namespace ExpenseTracker.Api.Models;

/// <summary>
/// Representa os dois únicos tipos de transação financeira aceitos pelo sistema.
/// Usar um enum evita valores "mágicos" (strings soltas) espalhados pelo código
/// e garante que o EF Core/JSON só aceitem esses dois valores.
/// </summary>
public enum TransactionType
{
    Receita = 0, // Entrada de dinheiro
    Despesa = 1  // Saída de dinheiro
}
