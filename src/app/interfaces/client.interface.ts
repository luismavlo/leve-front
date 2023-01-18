export interface ClientResp {
  dataClients: DataClient[];
  page: number;
}

export interface DataClient {
  id: string;
  name: string;
  surname: string;
  dni: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  status: boolean;
  createAt: Date;
  updateAt: Date;
}

export interface Client {
  id?: string;
  name: string;
  surname: string;
  dni: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}
