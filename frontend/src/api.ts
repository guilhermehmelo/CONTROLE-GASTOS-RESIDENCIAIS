import type { Person, Transaction, Totals, TransactionType } from "./types";

// URL base da API .NET. Em desenvolvimento, o back-end costuma rodar em
// https://localhost:5001 ou http://localhost:5000 - ajuste conforme o
// endereço exibido no terminal ao rodar `dotnet run`.
const API_BASE_URL = "http://localhost:5000/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Erro na requisição (status ${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // resposta sem corpo JSON, mantém mensagem padrão
    }
    throw new Error(message);
  }
  // Respostas 204 (No Content) não têm corpo para parsear
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // ---------- Pessoas ----------
  async listPeople(): Promise<Person[]> {
    const res = await fetch(`${API_BASE_URL}/people`);
    return handleResponse<Person[]>(res);
  },

  async createPerson(name: string, age: number): Promise<Person> {
    const res = await fetch(`${API_BASE_URL}/people`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age }),
    });
    return handleResponse<Person>(res);
  },

  async deletePerson(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/people/${id}`, {
      method: "DELETE",
    });
    return handleResponse<void>(res);
  },

  // ---------- Transações ----------
  async listTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE_URL}/transactions`);
    return handleResponse<Transaction[]>(res);
  },

  async createTransaction(
    description: string,
    amount: number,
    type: TransactionType,
    personId: string
  ): Promise<Transaction> {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, amount, type, personId }),
    });
    return handleResponse<Transaction>(res);
  },

  // ---------- Totais ----------
  async getTotals(): Promise<Totals> {
    const res = await fetch(`${API_BASE_URL}/totals`);
    return handleResponse<Totals>(res);
  },
};
