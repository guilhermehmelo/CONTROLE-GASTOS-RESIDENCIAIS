import { useEffect, useState } from "react";
import { api } from "../api";
import type { Person } from "../types";

/**
 * Tela de cadastro de pessoas: permite criar, listar e deletar pessoas.
 * Ao deletar uma pessoa, o back-end remove em cascata todas as suas transações.
 */
export default function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadPeople() {
    try {
      const data = await api.listPeople();
      setPeople(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadPeople();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || age === "") {
      setError("Preencha nome e idade.");
      return;
    }

    setLoading(true);
    try {
      await api.createPerson(name.trim(), Number(age));
      setName("");
      setAge("");
      await loadPeople();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta pessoa também excluirá todas as suas transações. Confirma?")) {
      return;
    }
    setError(null);
    try {
      await api.deletePerson(id);
      await loadPeople();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Nova pessoa</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleCreate} className="form-row">
          <div>
            <label>Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria Silva"
            />
          </div>
          <div>
            <label>Idade</label>
            <input
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ex: 30"
              style={{ width: 90 }}
            />
          </div>
          <button className="primary" type="submit" disabled={loading}>
            Cadastrar
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Pessoas cadastradas</h3>
        {people.length === 0 ? (
          <p className="empty">Nenhuma pessoa cadastrada ainda.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>
                    {p.isMinor && <span className="badge minor">Menor de idade</span>}
                  </td>
                  <td>
                    <button className="danger" onClick={() => handleDelete(p.id)}>
                      Excluir
                    </button>
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
