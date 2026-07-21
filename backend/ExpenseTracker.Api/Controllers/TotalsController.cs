using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.DTOs;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Controllers;

/// <summary>
/// Endpoint de consulta de totais: para cada pessoa, exibe total de receitas,
/// total de despesas e saldo; ao final, exibe o total geral consolidado.
/// </summary>
[ApiController]
[Route("api/totals")]
public class TotalsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotalsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<TotalsResponse>> GetTotals()
    {
        // Carrega pessoas com suas transações para calcular os totais em memória.
        var people = await _context.People
            .Include(p => p.Transactions)
            .OrderBy(p => p.Name)
            .ToListAsync();

        var response = new TotalsResponse();

        foreach (var person in people)
        {
            var income = person.Transactions
                .Where(t => t.Type == TransactionType.Receita)
                .Sum(t => t.Amount);

            var expense = person.Transactions
                .Where(t => t.Type == TransactionType.Despesa)
                .Sum(t => t.Amount);

            response.People.Add(new PersonTotalsResponse
            {
                PersonId = person.Id,
                PersonName = person.Name,
                Age = person.Age,
                TotalIncome = income,
                TotalExpense = expense,
                Balance = income - expense
            });
        }

        // Totais gerais: soma de todas as pessoas.
        response.GrandTotalIncome = response.People.Sum(p => p.TotalIncome);
        response.GrandTotalExpense = response.People.Sum(p => p.TotalExpense);
        response.GrandTotalBalance = response.GrandTotalIncome - response.GrandTotalExpense;

        return Ok(response);
    }
}
