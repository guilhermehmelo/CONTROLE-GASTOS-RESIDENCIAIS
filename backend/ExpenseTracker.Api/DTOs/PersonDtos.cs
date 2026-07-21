using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Api.DTOs;

/// <summary>
/// Dados necessários para criar uma pessoa. Note que o Id NÃO é informado
/// pelo cliente: ele é sempre gerado pelo servidor.
/// </summary>
public class CreatePersonRequest
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 150, ErrorMessage = "Idade inválida.")]
    public int Age { get; set; }
}

/// <summary>
/// Representação de pessoa retornada pela API (listagem simples).
/// </summary>
public class PersonResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public bool IsMinor { get; set; }
}
