import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createCategory(data: Category): Observable<Category> {
    const url = `${this.apiUrl}categories/`;
    return this.http.post<Category>(url, data);
  }

  getCategories(): Observable<Category[]> {
    const url = `${this.apiUrl}categories/`;
    return this.http.get<Category[]>(url);
  }
}
