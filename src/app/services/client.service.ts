import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client, ClientResp } from '../interfaces/client.interface';
import { tokenHeader } from '../utils/getConfig';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  getClient(term: string): Observable<ClientResp> {
    return this.http.get<ClientResp>(`${base_url}/clients/${term}`, {
      headers: tokenHeader.headers,
    });
  }

  getAllClientByTerm(term: string, offset: number): Observable<ClientResp> {
    const params = new HttpParams().set('limit', 5).set('offset', offset);

    return this.http.get<ClientResp>(`${base_url}/clients/term/${term}`, {
      headers: tokenHeader.headers,
      params,
    });
  }

  getClients(offset: number, limit: number = 5): Observable<ClientResp> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);

    return this.http.get<ClientResp>(`${base_url}/clients`, {
      headers: tokenHeader.headers,
      params,
    });
  }

  createClient(client: Client): Observable<ClientResp> {
    return this.http.post<ClientResp>(`${base_url}/clients`, client, {
      headers: tokenHeader.headers,
    });
  }

  updateClient(client: Client, id: string): Observable<ClientResp> {
    return this.http.patch<ClientResp>(`${base_url}/clients/${id}`, client, {
      headers: tokenHeader.headers,
    });
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete<any>(`${base_url}/clients/${id}`, {
      headers: tokenHeader.headers,
    });
  }
}
