import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResult } from '../../shared/models/page-result.model';
import { DEFAULT_PAGINATION } from '../../shared/constants/pagination.constants';
import { buildPaginationParams } from '../../shared/utils/http-params.util';
import { HomeDto } from '../../shared/dtos/home-dto.model';
import { Home } from '../../shared/models/home.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  publishHome(data: HomeDto): Observable<Home> {
    const url = `${this.apiUrl}homes/`;
    return this.http.post<Home>(url, data);
  }

  //   getAllHomes(
  //     page: number = DEFAULT_PAGINATION.PAGE,
  //     size: number = 9,
  //     orderAsc: boolean = DEFAULT_PAGINATION.ORDER_ASC
  //   ): Observable<PageResult<HomeResponse>> {
  //     const url = `${this.apiUrl}homes/`;
  //     const params = buildPaginationParams(page, size, orderAsc);
  //     return this.http.get<PageResult<HomeResponse>>(url, { params });
  //   }
}
