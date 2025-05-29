import { Component, inject } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { LocationResponse } from 'src/app/shared/dtos/location-response.model';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-location-page',
  templateUrl: './create-location-page.component.html',
  styleUrls: ['./create-location-page.component.scss'],
})
export class CreateLocationPageComponent {
  private readonly locationService = inject(LocationService);
  private readonly filterSubject = new BehaviorSubject<string>('a');
  private readonly currentPageSubject = new BehaviorSubject<number>(0);
  private readonly orderAscSubject = new BehaviorSubject<boolean>(true);

  filter$ = this.filterSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();
  orderAsc$ = this.orderAscSubject.asObservable();
  orderAsc = true;

  locations$: Observable<PageResult<LocationResponse>> = combineLatest([
    this.filter$,
    this.currentPage$,
    this.orderAsc$,
  ]).pipe(
    switchMap(([filter, page, orderAsc]) => {
      this.orderAsc = orderAsc;
      return this.locationService.getAllLocations(
        filter,
        page,
        undefined,
        orderAsc
      );
    })
  );

  onFilterChange(value: string): void {
    this.filterSubject.next(value && value.trim() !== '' ? value : 'a');
    this.currentPageSubject.next(0); // Reset to first page on filter change
  }
  onPageChange(page: number): void {
    this.currentPageSubject.next(page);
  }
  onLocationCreated(): void {
    this.currentPageSubject.next(this.currentPageSubject.getValue());
  }
  toggleOrderAsc(): void {
    this.orderAscSubject.next(!this.orderAscSubject.getValue());
  }
}
