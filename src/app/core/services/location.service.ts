import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../../shared/models/location.model';
import { environment } from '../../../environments/environment';
import { PageResult } from '../../shared/models/page-result.model';
import { DEFAULT_PAGINATION } from '../../shared/constants/pagination.constants';
import { buildPaginationParams } from '../../shared/utils/http-params.util';
import { LocationDto } from '../../shared/dtos/location-dto.model';
import { LocationResponse } from '../../shared/dtos/location-response.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createLocation(data: LocationDto): Observable<Location> {
    const url = `${this.apiUrl}locations/`;
    return this.http.post<Location>(url, data);
  }

  getAllLocations(
    text: string = '',
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE,
    orderAsc: boolean = DEFAULT_PAGINATION.ORDER_ASC
  ): Observable<PageResult<LocationResponse>> {
    const url = `${this.apiUrl}locations/`;
    const params = { text, page, size, orderAsc };
    return this.http.get<PageResult<LocationResponse>>(url, { params });
  }
}

// getAllLocations(
//   text: string = '',
//   page: number = DEFAULT_PAGINATION.PAGE,
//   size: number = DEFAULT_PAGINATION.SIZE,
//   orderAsc: boolean = DEFAULT_PAGINATION.ORDER_ASC
// ): Observable<PageResult<Location>> {
//   const url = `${this.apiUrl}locations/`;
//   const params = buildPaginationParams(text, page, size, orderAsc);
//   return this.http.get<PageResult<Location>>(url, { params });
// }
