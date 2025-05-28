import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResult } from '../../shared/models/page-result.model';
import { DEFAULT_PAGINATION } from '../../shared/constants/pagination.constants';
import { buildPaginationParams } from '../../shared/utils/http-params.util';
import { UserDto } from '../../shared/dtos/user-dto.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiUrlUser;

  constructor(private readonly http: HttpClient) {}

  createUser(data: UserDto): Observable<UserDto> {
    const url = `${this.apiUrl}users/`;
    return this.http.post<UserDto>(url, data);
  }

  //   getAllUsers(
  //     page: number = DEFAULT_PAGINATION.PAGE,
  //     size: number = DEFAULT_PAGINATION.SIZE,
  //     orderAsc: boolean = DEFAULT_PAGINATION.ORDER_ASC
  //   ): Observable<PageResult<UserResponse>> {
  //     const url = `${this.apiUrl}users/`;
  //     const params = buildPaginationParams(page, size, orderAsc);
  //     return this.http.get<PageResult<UserResponse>>(url, { params });
  //   }
}
