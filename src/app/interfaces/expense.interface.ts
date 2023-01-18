export interface Expense {
  id?: string;
  description: string;
  value: number;
  type: string;
}

export interface ExpenseResp {
  dataExpense: DataExpense[];
  page: number;
}

export interface DataExpense {
  id: string;
  description: string;
  value: number;
  type: string;
  status: boolean;
  createAt: Date;
  updateAt: Date;
}
