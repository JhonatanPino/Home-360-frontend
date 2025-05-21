import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesTableComponent } from './categories-table.component';
import { Category } from 'src/app/shared/models/category.model';

describe('CategoriesTableComponent', () => {
  let component: CategoriesTableComponent;
  let fixture: ComponentFixture<CategoriesTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesTableComponent],
    });
    fixture = TestBed.createComponent(CategoriesTableComponent);
    component = fixture.componentInstance;
  });

  test('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  test('debe renderizar las filas de la tabla según las categorías', () => {
    const categories: Category[] = [
      { id: 1, name: 'Categoría 1', description: 'Descripción 1' },
      { id: 2, name: 'Categoría 2', description: 'Descripción 2' },
    ];
    component.categories = categories;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Categoría 1');
    expect(rows[1].textContent).toContain('Categoría 2');
  });

  test('debe mostrar mensaje si no hay categorías', () => {
    component.categories = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay categorías');
  });
});
