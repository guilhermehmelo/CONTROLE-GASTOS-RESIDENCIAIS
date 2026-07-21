using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.DTOs;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Controllers;

/// <summary>
/// Endpoints de gerenciamento de pessoas: criação, listagem e deleção.
/// </summary>
[ApiController]
[Route("api/people")]
public class PeopleController : ControllerBase
{
    private readonly AppDbContext _context;

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<PersonResponse>>> GetAll()
    {
        var people = await _context.People
            .OrderBy(p => p.Name)
            .Select(p => new PersonResponse
            {
                Id = p.Id,
                Name = p.Name,
                Age = p.Age,
                IsMinor = p.Age < 18
            })
            .ToListAsync();

        return Ok(people);
    }

    /// <summary>
    /// Cria uma nova pessoa. O Id é gerado automaticamente pelo servidor.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PersonResponse>> Create(CreatePersonRequest request)
    {
        var person = new Person
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Age = request.Age
        };

        _context.People.Add(person);
        await _context.SaveChangesAsync();

        var response = new PersonResponse
        {
            Id = person.Id,
            Name = person.Name,
            Age = person.Age,
            IsMinor = person.IsMinor
        };

        return CreatedAtAction(nameof(GetAll), new { id = person.Id }, response);
    }

    /// <summary>
    /// Remove uma pessoa. Todas as transações associadas a ela são removidas
    /// automaticamente em cascata (configurado no AppDbContext), conforme
    /// exigido pelas regras de negócio do desafio.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var person = await _context.People.FindAsync(id);
        if (person is null)
        {
            return NotFound(new { message = "Pessoa não encontrada." });
        }

        _context.People.Remove(person);
        await _context.SaveChangesAsync(); // cascade delete remove as transações no banco

        return NoContent();
    }
}
