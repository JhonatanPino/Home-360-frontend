import { Component, inject } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { Location } from 'src/app/shared/models/location.model';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-location-page',
  templateUrl: './create-location-page.component.html',
  styleUrls: ['./create-location-page.component.scss'],
})
export class CreateLocationPageComponent {
  private readonly locationService = inject(LocationService);
  private readonly currentPageSubject = new BehaviorSubject<number>(0);
  private readonly orderAscSubject = new BehaviorSubject<boolean>(true);

  currentPage$ = this.currentPageSubject.asObservable();
  orderAsc$ = this.orderAscSubject.asObservable();

  orderAsc = true;
  locations$: Observable<PageResult<Location>> = combineLatest([
    this.currentPage$,
    this.orderAsc$,
  ]).pipe(
    switchMap(([page, orderAsc]) => {
      this.orderAsc = orderAsc; // Actualiza el estado para el botón
      return this.locationService.getAllLocations(page, undefined, orderAsc);
    })
  );
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
