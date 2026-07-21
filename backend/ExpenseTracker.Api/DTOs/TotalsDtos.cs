namespace ExpenseTracker.Api.DTOs;

/// <summary>
/// Totais (receitas, despesas e saldo) de uma única pessoa.
/// </summary>
public class PersonTotalsResponse
{
    public Guid PersonId { get; set; }
    public string PersonName { get; set; } = string.Empty;
    public int Age { get; set; }
    public decimal TotalIncome { get; set; }   // Total de receitas
    public decimal TotalExpense { get; set; }  // Total de despesas
    public decimal Balance { get; set; }       // Saldo = receitas - despesas
}

/// <summary>
/// Resposta completa da consulta de totais: lista de pessoas com seus totais
/// individuais + o total geral consolidado de todas as pessoas.
/// </summary>
public class TotalsResponse
{
    public List<PersonTotalsResponse> People { get; set; } = new();

    public decimal GrandTotalIncome { get; set; }
    public decimal GrandTotalExpense { get; set; }
    public decimal GrandTotalBalance { get; set; }
}
