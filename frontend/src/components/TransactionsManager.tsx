import { useEffect, useState } from "react";
import { api } from "../api";
import type { Person, Transaction, TransactionType } from "../types";

/**
 * Tela de cadastro de transações: criação e listagem.
 * Aplica no front-end a mesma regra de negócio validada no back-end
 * (pessoas menores de 18 anos só podem ter despesas cadastradas),
 * para dar feedback imediato ao usuário — mas a validação real e
 * definitiva acontece sempre no servidor.
 */
export default function TransactionsManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("Despesa");
  const [personId, setPersonId] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPerson = people.find((p) => p.id === personId);

  async function loadData() {
    try {
      const [peopleData, txData] = await Promise.all([
        api.listPeople(),
        api.listTransactions(),
      ]);
      setPeople(peopleData);
      setTransactions(txData);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Se a pessoa selecionada for menor de idade, força o tipo para Despesa.
  useEffect(() => {
    if (selectedPerson?.isMinor && type === "Receita") {
      setType("Despesa");
    }
  }, [selectedPerson, type]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!description.trim() || !amount || !personId) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await api.createTransaction(description.trim(), Number(amount), type, personId);
      setDescription("");
      setAmount("");
      await loadData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Nova transação</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleCreate} className="form-row">
          <div>
            <label>Pessoa</label>
            <select value={personId} onChange={(e) => setPersonId(e.target.value)}>
              <option value="">Selecione...</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.isMinor ? "(menor)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Descrição</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado"
            />
          </div>
          <div>
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: 110 }}
            />
          </div>
          <div>
            <label>Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita" disabled={!!selectedPerson?.isMinor}>
                Receita
              </option>
            </select>
          </div>
          <button className="primary" type="submit" disabled={loading || people.length === 0}>
            Cadastrar
          </button>
        </form>
        {selectedPerson?.isMinor && (
          <p className="hint">
            {selectedPerson.name} é menor de idade: apenas despesas podem ser cadastradas.
          </p>
        )}
        {people.length === 0 && (
          <p className="hint">Cadastre ao menos uma pessoa antes de lançar transações.</p>
        )}
      </div>

      <div className="card">
        <h3>Transações cadastradas</h3>
        {transactions.length === 0 ? (
          <p className="empty">Nenhuma transação cadastrada ainda.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Pessoa</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.createdAt).toLocaleString("pt-BR")}</td>
                  <td>{t.personName}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className={`badge ${t.type === "Receita" ? "income" : "expense"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>
                    {t.amount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
