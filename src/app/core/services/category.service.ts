import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { environment } from '../../../environments/environment';
import { PageResult } from '../../shared/models/page-result.model';
import { DEFAULT_PAGINATION } from '../../shared/constants/pagination.constants';
import { buildPaginationParams } from '../../shared/utils/http-params.util';

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

  getAllCategories(
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE,
    orderAsc: boolean = DEFAULT_PAGINATION.ORDER_ASC
  ): Observable<PageResult<Category>> {
    const url = `${this.apiUrl}categories/`;
    const params = buildPaginationParams(page, size, orderAsc);
    return this.http.get<PageResult<Category>>(url, { params });
  }
}
