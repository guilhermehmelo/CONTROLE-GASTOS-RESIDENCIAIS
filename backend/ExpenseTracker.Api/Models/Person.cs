namespace ExpenseTracker.Api.Models;

/// <summary>
/// Entidade que representa uma pessoa cadastrada no sistema de controle de gastos.
/// </summary>
public class Person
{
    /// <summary>
    /// Identificador único, gerado automaticamente pelo banco (Guid).
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public int Age { get; set; }

    /// <summary>
    /// Propriedade de navegação: todas as transações pertencentes a essa pessoa.
    /// Configurada com "delete cascade" no DbContext, ou seja, ao remover a pessoa,
    /// todas as transações associadas são removidas automaticamente pelo banco.
    /// </summary>
    public List<Transaction> Transactions { get; set; } = new();

    /// <summary>
    /// Regra de negócio central: pessoas com menos de 18 anos são consideradas menores
    /// de idade e, por isso, só podem ter DESPESAS cadastradas em seu nome (não podem
    /// registrar receitas).
    /// </summary>
    public bool IsMinor => Age < 18;
}
