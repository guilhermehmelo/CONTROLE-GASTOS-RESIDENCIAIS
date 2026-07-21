using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.DTOs;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Controllers;

/// <summary>
/// Endpoints de gerenciamento de transações: criação e listagem.
/// (O desafio não exige edição/deleção de transações.)
/// </summary>
[ApiController]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todas as transações cadastradas, já com o nome da pessoa
    /// para facilitar a exibição no front-end.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<TransactionResponse>>> GetAll()
    {
        var transactions = await _context.Transactions
            .Include(t => t.Person)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TransactionResponse
            {
                Id = t.Id,
                Description = t.Description,
                Amount = t.Amount,
                Type = t.Type,
                PersonId = t.PersonId,
                PersonName = t.Person!.Name,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(transactions);
    }

    /// <summary>
    /// Cria uma nova transação, aplicando as regras de negócio:
    /// 1) A pessoa informada precisa existir previamente no cadastro.
    /// 2) Se a pessoa for menor de idade (idade &lt; 18), somente DESPESAS
    ///    podem ser cadastradas em seu nome — receitas são bloqueadas.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Create(CreateTransactionRequest request)
    {
        var person = await _context.People.FindAsync(request.PersonId);
        if (person is null)
        {
            // Regra: o Id da pessoa precisa existir no cadastro de pessoas.
            return BadRequest(new { message = "Pessoa informada não existe no cadastro." });
        }

        if (person.IsMinor && request.Type == TransactionType.Receita)
        {
            // Regra de negócio: menores de 18 anos só podem ter despesas cadastradas.
            return BadRequest(new
            {
                message = "Pessoas menores de 18 anos só podem ter despesas cadastradas, não receitas."
            });
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Description = request.Description.Trim(),
            Amount = request.Amount,
            Type = request.Type,
            PersonId = request.PersonId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var response = new TransactionResponse
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Amount = transaction.Amount,
            Type = transaction.Type,
            PersonId = transaction.PersonId,
            PersonName = person.Name,
            CreatedAt = transaction.CreatedAt
        };

        return CreatedAtAction(nameof(GetAll), new { id = transaction.Id }, response);
    }
}
