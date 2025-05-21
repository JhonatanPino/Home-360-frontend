import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let faIconLibraryMock: any;

  beforeEach(() => {
    faIconLibraryMock = { addIcons: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      providers: [{ provide: FaIconLibrary, useValue: faIconLibraryMock }],
    });

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('debe generar los números de página correctamente', () => {
    component.totalPages = 3;
    component.ngOnChanges({
      totalPages: {
        currentValue: 3,
        previousValue: 0,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(component.pageNumbers).toEqual([0, 1, 2]);
  });

  test('debe limpiar los números de página si totalPages es 0', () => {
    component.totalPages = 0;
    component.ngOnChanges({
      totalPages: {
        currentValue: 0,
        previousValue: 2,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(component.pageNumbers).toEqual([]);
  });

  test('debe emitir pageChange al ir a una página válida', () => {
    component.totalPages = 5;
    component.currentPage = 2;
    const spy = jest.spyOn(component.pageChange, 'emit');
    component.goToPage(3);
    expect(spy).toHaveBeenCalledWith(3);
  });

  test('no debe emitir pageChange si la página es la actual', () => {
    component.totalPages = 5;
    component.currentPage = 2;
    const spy = jest.spyOn(component.pageChange, 'emit');
    component.goToPage(2);
    expect(spy).not.toHaveBeenCalled();
  });

  test('no debe emitir pageChange si la página es inválida', () => {
    component.totalPages = 5;
    component.currentPage = 2;
    const spy = jest.spyOn(component.pageChange, 'emit');
    component.goToPage(-1);
    component.goToPage(5);
    expect(spy).not.toHaveBeenCalled();
  });
});
