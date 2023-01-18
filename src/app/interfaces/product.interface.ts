export interface ProductDetail {
  id: string;
  title: string;
  code: string;
  description: string;
  stock?: number;
  price: number;
  status: boolean;
  createAt: Date;
  updateAt: Date;
}

export interface Product {
  title: string;
  code: string;
  description: string;
  price: number;
}
