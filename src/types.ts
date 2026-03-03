export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  type: TransactionType;
  categoryId?: string;
  accountId: string; // Source account
  toAccountId?: string; // Destination account (for transfers)
  note?: string;
  createdAt: number;
}

export interface Account {
  id: string;
  name: string;
  groupId: string;
  initialBalance: number;
  excludeFromTotals: boolean;
  color?: string;
}

export interface Group {
  id: string;
  name: string;
  type: "bank" | "credit" | "investment" | "cash" | "other";
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
}

export interface AppState {
  transactions: Transaction[];
  accounts: Account[];
  groups: Group[];
  categories: Category[];
}
