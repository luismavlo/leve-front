import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, ProductDetail } from '../interfaces/product.interface';
import { tokenHeader } from '../utils/getConfig';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProduct(term: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${base_url}/products/${term}`, {
      headers: tokenHeader.headers,
    });
  }

  getProducts(): Observable<ProductDetail[]> {
    return this.http.get<ProductDetail[]>(`${base_url}/products`, {
      headers: tokenHeader.headers,
    });
  }

  createProduct(product: Product) {
    return this.http.post(`${base_url}/products`, product, {
      headers: tokenHeader.headers,
    });
  }

  updateProduct(product: Product, id: string) {
    return this.http.patch(`${base_url}/products/${id}`, product, {
      headers: tokenHeader.headers,
    });
  }

  deleteProduct(id: string) {
    return this.http.delete(`${base_url}/products/${id}`, {
      headers: tokenHeader.headers,
    });
  }
}
