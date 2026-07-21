using System.ComponentModel.DataAnnotations;
using ExpenseTracker.Api.Models;

namespace ExpenseTracker.Api.DTOs;

/// <summary>
/// Dados necessários para criar uma transação.
/// </summary>
public class CreateTransactionRequest
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal Amount { get; set; }

    [Required]
    public TransactionType Type { get; set; }

    [Required(ErrorMessage = "É necessário informar a pessoa dona da transação.")]
    public Guid PersonId { get; set; }
}

/// <summary>
/// Representação de transação retornada pela API, já incluindo o nome da pessoa
/// para facilitar a exibição no front-end sem precisar de outra chamada.
/// </summary>
public class TransactionResponse
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public Guid PersonId { get; set; }
    public string PersonName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
