namespace ExpenseTracker.Api.Models;

/// <summary>
/// Entidade que representa uma transação financeira (receita ou despesa)
/// associada a uma pessoa.
/// </summary>
public class Transaction
{
    /// <summary>
    /// Identificador único, gerado automaticamente (Guid).
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Valor monetário da transação. Sempre armazenado como valor positivo;
    /// o sinal (soma ou subtração) é definido pelo campo Type no momento do cálculo
    /// dos totais, evitando ambiguidade entre "valor negativo" e "despesa".
    /// </summary>
    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    /// <summary>
    /// Chave estrangeira para a pessoa dona da transação.
    /// </summary>
    public Guid PersonId { get; set; }

    public Person? Person { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
