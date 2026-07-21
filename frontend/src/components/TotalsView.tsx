import { useEffect, useState } from "react";
import { api } from "../api";
import type { Totals } from "../types";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Tela de consulta de totais: lista cada pessoa com seu total de receitas,
 * despesas e saldo, e exibe ao final o total geral consolidado.
 */
export default function TotalsView() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api.getTotals();
      setTotals(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!totals) return <p className="empty">Carregando...</p>;

  return (
    <div className="card">
      <h3>Totais por pessoa</h3>
      {totals.people.length === 0 ? (
        <p className="empty">Nenhuma pessoa cadastrada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Idade</th>
              <th>Receitas</th>
              <th>Despesas</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {totals.people.map((p) => (
              <tr key={p.personId}>
                <td>{p.personName}</td>
                <td>{p.age}</td>
                <td>{formatCurrency(p.totalIncome)}</td>
                <td>{formatCurrency(p.totalExpense)}</td>
                <td className={p.balance >= 0 ? "positive" : "negative"}>
                  {formatCurrency(p.balance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Total geral</td>
              <td>{formatCurrency(totals.grandTotalIncome)}</td>
              <td>{formatCurrency(totals.grandTotalExpense)}</td>
              <td className={totals.grandTotalBalance >= 0 ? "positive" : "negative"}>
                {formatCurrency(totals.grandTotalBalance)}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
