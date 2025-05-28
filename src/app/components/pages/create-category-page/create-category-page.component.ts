import { Component, inject } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { Category } from 'src/app/shared/models/category.model';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-category-page',
  templateUrl: './create-category-page.component.html',
  styleUrls: ['./create-category-page.component.scss'],
})
export class CreateCategoryPageComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly currentPageSubject = new BehaviorSubject<number>(0);
  private readonly orderAscSubject = new BehaviorSubject<boolean>(true);

  currentPage$ = this.currentPageSubject.asObservable();
  orderAsc$ = this.orderAscSubject.asObservable();
  orderAsc = true;

  categories$: Observable<PageResult<Category>> = combineLatest([
    this.currentPage$,
    this.orderAsc$,
  ]).pipe(
    switchMap(([page, orderAsc]) => {
      this.orderAsc = orderAsc; // Actualiza el estado para el botón
      return this.categoryService.getAllCategories(page, undefined, orderAsc);
    })
  );

  onPageChange(page: number): void {
    this.currentPageSubject.next(page);
  }

  onCategoryCreated(): void {
    this.currentPageSubject.next(this.currentPageSubject.getValue());
  }

  toggleOrderAsc(): void {
    this.orderAscSubject.next(!this.orderAscSubject.getValue());
  }
}
