export interface LotResp {
  page: number;
  dataLots: DataLot[];
}

export interface DataLot {
  id: string;
  quantityLiters: number;
  code: string;
  discount: number;
  discountReason: string;
  typeLot: string;
  costLiter: number;
  reusedBottles: number;
  lotTotalCost: number;
  status: boolean;
  createAt: Date;
  updateAt: Date;
  expensesPerLot: ExpensesPerLot[];
}

export interface ExpensesPerLot {
  id: string;
  value: number;
  status: boolean;
  createAt: Date;
  updateAt: Date;
  expense: Expense;
}

export interface Expense {
  id: string;
  description: string;
  value: number;
  type: string;
  status: boolean;
  createAt: Date;
  updateAt: Date;
}

export interface Lot {
  id?: string;
  code: string;
  quantityLiters: number;
  discount: number;
  discountReason: string;
  typeLot: string;
  costLiter: number;
  reusedBottles: number;
  lotTotalCost: number;
}
