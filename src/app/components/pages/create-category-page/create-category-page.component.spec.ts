import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateCategoryPageComponent } from './create-category-page.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { Category } from 'src/app/shared/models/category.model';

describe('CreateCategoryPageComponent', () => {
  let component: CreateCategoryPageComponent;
  let mockCategoryService: any;

  beforeEach(() => {
    mockCategoryService = {
      getAllCategories: jest.fn().mockReturnValue(
        of({
          content: [],
          page: 0,
          size: 0,
          orderAsc: true,
          totalElements: 0,
          totalPages: 0,
        } as PageResult<Category>)
      ),
    };

    TestBed.configureTestingModule({
      declarations: [CreateCategoryPageComponent],
      providers: [{ provide: CategoryService, useValue: mockCategoryService }],
    });

    component = TestBed.createComponent(
      CreateCategoryPageComponent
    ).componentInstance;
  });

  test('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  test('debe cambiar la página actual al llamar onPageChange', (done) => {
    component.currentPage$.subscribe((page) => {
      expect(page).toBe(2);
      done();
    });
    component.onPageChange(2);
  });

  test('debe alternar el orden al llamar toggleOrderAsc', (done) => {
    // Estado inicial: true
    component.orderAsc$.subscribe((orderAsc) => {
      if (orderAsc === false) {
        expect(orderAsc).toBe(false);
        done();
      }
    });
    component.toggleOrderAsc();
  });

  test('debe recargar la página al llamar onCategoryCreated', (done) => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onCategoryCreated();
    expect(spy).toHaveBeenCalledWith(
      component['currentPageSubject'].getValue()
    );
    done();
  });

  test('debe llamar a getAllCategories con los parámetros correctos', (done) => {
    component.categories$.subscribe(() => {
      expect(mockCategoryService.getAllCategories).toHaveBeenCalledWith(
        0,
        undefined,
        true
      );
      done();
    });
  });
});
