import { CreateCategoryPageComponent } from './create-category-page.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { of } from 'rxjs';

describe('CreateCategoryPageComponent', () => {
  let component: CreateCategoryPageComponent;
  let mockCategoryService: any;

  beforeEach(() => {
    mockCategoryService = {
      getAllCategories: jest
        .fn()
        .mockReturnValue(of({ results: [], total: 0 })),
    };

    jest
      .spyOn(require('@angular/core'), 'inject')
      .mockImplementation((token: any) => {
        if (token === CategoryService) return mockCategoryService;
        throw new Error('Servicio no mockeado: ' + token);
      });

    component = new CreateCategoryPageComponent();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cambiar la página actual al llamar onPageChange', (done) => {
    component.currentPage$.subscribe((page) => {
      expect(page).toBe(2);
      done();
    });
    component.onPageChange(2);
  });

  it('debe alternar el orden al llamar toggleOrderAsc', (done) => {
    // Estado inicial: true
    component.orderAsc$.subscribe((orderAsc) => {
      if (orderAsc === false) {
        expect(orderAsc).toBe(false);
        done();
      }
    });
    component.toggleOrderAsc();
  });

  it('debe recargar la página al llamar onCategoryCreated', (done) => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onCategoryCreated();
    expect(spy).toHaveBeenCalledWith(
      component['currentPageSubject'].getValue()
    );
    done();
  });

  it('debe llamar a getAllCategories con los parámetros correctos', (done) => {
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
