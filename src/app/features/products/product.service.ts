import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from './product.model';
import { environment } from '../../../environments/environment';

export type CreateProductDto = Omit<Product, 'id'>;
export type UpdateProductDto = Omit<Product, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: UpdateProductDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number) : Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkNameExists(name: string, excludeId?: number): Observable<boolean> {
    let params = new HttpParams().set('name', name);

    if (excludeId)
        params = params.set('excludeId', excludeId.toString());

    return this.http
    .get<{exists: boolean}>(`${this.apiUrl}/check-name`, { params })
    .pipe(map(response => response.exists));
  }
}