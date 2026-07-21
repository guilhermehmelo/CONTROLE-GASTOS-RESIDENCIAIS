// Tipos que espelham os DTOs do back-end (.NET), garantindo tipagem
// consistente entre front-end e back-end.

export type TransactionType = "Receita" | "Despesa";

export interface Person {
  id: string;
  name: string;
  age: number;
  isMinor: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  personId: string;
  personName: string;
  createdAt: string;
}

export interface PersonTotals {
  personId: string;
  personName: string;
  age: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface Totals {
  people: PersonTotals[];
  grandTotalIncome: number;
  grandTotalExpense: number;
  grandTotalBalance: number;
}
