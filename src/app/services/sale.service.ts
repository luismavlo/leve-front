import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tokenHeader } from '../utils/getConfig';
import { DataSale, Sale, SaleResp } from '../interfaces/sales.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private http: HttpClient) {}

  getSaleById(id: string): Observable<DataSale> {
    return this.http.get<DataSale>(`${base_url}/sales/${id}`, {
      headers: tokenHeader.headers,
    });
  }

  getSales(offset: number, limit: number = 5): Observable<SaleResp> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<SaleResp>(`${base_url}/sales`, {
      headers: tokenHeader.headers,
      params,
    });
  }

  getSaleByTerm(
    type: string,
    term: string,
    offset: number
  ): Observable<SaleResp> {
    const params = new HttpParams().set('limit', 5).set('offset', offset);
    return this.http.get<SaleResp>(`${base_url}/sales/${type}/${term}`, {
      headers: tokenHeader.headers,
      params,
    });
  }

  createSale(sale: Sale): Observable<any> {
    return this.http.post<any>(`${base_url}/sales`, sale, {
      headers: tokenHeader.headers,
    });
  }

  updateSale(sale: Sale, id: string): Observable<any> {
    return this.http.patch<any>(`${base_url}/sales/${id}`, sale, {
      headers: tokenHeader.headers,
    });
  }

  deleteSale(id: string): Observable<any> {
    return this.http.delete<any>(`${base_url}/sales/${id}`, {
      headers: tokenHeader.headers,
    });
  }
}
