import { useState } from "react";
import PeopleManager from "./components/PeopleManager";
import TransactionsManager from "./components/TransactionsManager";
import TotalsView from "./components/TotalsView";

type Tab = "people" | "transactions" | "totals";

export default function App() {
  const [tab, setTab] = useState<Tab>("people");

  return (
    <div className="app">
      <h1>Controle de Gastos Residenciais</h1>
      <p className="subtitle">Cadastro de pessoas, transações e consulta de totais.</p>

      <nav className="tabs">
        <button className={tab === "people" ? "active" : ""} onClick={() => setTab("people")}>
          Pessoas
        </button>
        <button
          className={tab === "transactions" ? "active" : ""}
          onClick={() => setTab("transactions")}
        >
          Transações
        </button>
        <button className={tab === "totals" ? "active" : ""} onClick={() => setTab("totals")}>
          Totais
        </button>
      </nav>

      {tab === "people" && <PeopleManager />}
      {tab === "transactions" && <TransactionsManager />}
      {tab === "totals" && <TotalsView />}
    </div>
  );
}
