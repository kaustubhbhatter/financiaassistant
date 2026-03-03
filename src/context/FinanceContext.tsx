import React, { createContext, useContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { AppState, Transaction, Account, Group, Category, TransactionType } from "@/types";

const initialState: AppState = {
  transactions: [],
  accounts: [],
  groups: [],
  categories: [],
};

type Action =
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_ACCOUNT"; payload: Account }
  | { type: "UPDATE_ACCOUNT"; payload: Account }
  | { type: "DELETE_ACCOUNT"; payload: string }
  | { type: "ADD_GROUP"; payload: Group }
  | { type: "UPDATE_GROUP"; payload: Group }
  | { type: "DELETE_GROUP"; payload: string }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "LOAD_STATE"; payload: AppState }
  | { type: "RESET_STATE" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "ADD_ACCOUNT":
      return { ...state, accounts: [...state.accounts, action.payload] };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case "DELETE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.filter((a) => a.id !== action.payload),
      };
    case "ADD_GROUP":
      return { ...state, groups: [...state.groups, action.payload] };
    case "UPDATE_GROUP":
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      };
    case "DELETE_GROUP":
      return {
        ...state,
        groups: state.groups.filter((g) => g.id !== action.payload),
      };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      };
    case "LOAD_STATE":
      return action.payload;
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

const FinanceContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, "id">) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  addGroup: (group: Omit<Group, "id">) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
} | null>(null);

const STORAGE_KEY = "nebula_finance_data_v1";

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from local storage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        dispatch({ type: "LOAD_STATE", payload: parsedData });
      } catch (e) {
        console.error("Failed to parse stored data", e);
      }
    } else {
      // Seed initial data if empty
      seedInitialData();
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const seedInitialData = () => {
    const bankGroup = { id: uuidv4(), name: "Bank Accounts", type: "bank" as const };
    const creditGroup = { id: uuidv4(), name: "Credit Cards", type: "credit" as const };
    const cashGroup = { id: uuidv4(), name: "Cash", type: "cash" as const };

    const checkingAccount = {
      id: uuidv4(),
      name: "Checking",
      groupId: bankGroup.id,
      initialBalance: 1000,
      excludeFromTotals: false,
      color: "cyan",
    };
    
    const creditCard = {
      id: uuidv4(),
      name: "Primary Card",
      groupId: creditGroup.id,
      initialBalance: 0,
      excludeFromTotals: false,
      color: "fuchsia",
    };

    const cashAccount = {
      id: uuidv4(),
      name: "Wallet",
      groupId: cashGroup.id,
      initialBalance: 50,
      excludeFromTotals: false,
      color: "emerald",
    };

    const categories = [
      { id: uuidv4(), name: "Food & Dining", type: "expense" as const, color: "orange" },
      { id: uuidv4(), name: "Transportation", type: "expense" as const, color: "blue" },
      { id: uuidv4(), name: "Utilities", type: "expense" as const, color: "yellow" },
      { id: uuidv4(), name: "Entertainment", type: "expense" as const, color: "purple" },
      { id: uuidv4(), name: "Salary", type: "income" as const, color: "green" },
      { id: uuidv4(), name: "Investments", type: "income" as const, color: "indigo" },
    ];

    dispatch({
      type: "LOAD_STATE",
      payload: {
        transactions: [],
        accounts: [checkingAccount, creditCard, cashAccount],
        groups: [bankGroup, creditGroup, cashGroup],
        categories: categories,
      },
    });
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt">) => {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: { ...transaction, id: uuidv4(), createdAt: Date.now() },
    });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const addAccount = (account: Omit<Account, "id">) => {
    dispatch({ type: "ADD_ACCOUNT", payload: { ...account, id: uuidv4() } });
  };

  const updateAccount = (account: Account) => {
    dispatch({ type: "UPDATE_ACCOUNT", payload: account });
  };

  const deleteAccount = (id: string) => {
    dispatch({ type: "DELETE_ACCOUNT", payload: id });
  };

  const addGroup = (group: Omit<Group, "id">) => {
    dispatch({ type: "ADD_GROUP", payload: { ...group, id: uuidv4() } });
  };

  const updateGroup = (group: Group) => {
    dispatch({ type: "UPDATE_GROUP", payload: group });
  };

  const deleteGroup = (id: string) => {
    dispatch({ type: "DELETE_GROUP", payload: id });
  };

  const addCategory = (category: Omit<Category, "id">) => {
    dispatch({ type: "ADD_CATEGORY", payload: { ...category, id: uuidv4() } });
  };

  const updateCategory = (category: Category) => {
    dispatch({ type: "UPDATE_CATEGORY", payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: "DELETE_CATEGORY", payload: id });
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        dispatch,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addAccount,
        updateAccount,
        deleteAccount,
        addGroup,
        updateGroup,
        deleteGroup,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
