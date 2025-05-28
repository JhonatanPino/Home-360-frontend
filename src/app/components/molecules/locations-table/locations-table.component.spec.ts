import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationsTableComponent } from './locations-table.component';
import { By } from '@angular/platform-browser';

describe('LocationsTableComponent', () => {
  let component: LocationsTableComponent;
  let fixture: ComponentFixture<LocationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsTableComponent);
    component = fixture.componentInstance;
  });

  test('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  test('debe mostrar el mensaje de "No hay ubicaciones" si locations está vacío', () => {
    component.locations = [];
    fixture.detectChanges();
    const emptyRow = fixture.debugElement.query(
      By.css('.locations-table__empty')
    );
    expect(emptyRow).toBeTruthy();
    expect(emptyRow.nativeElement.textContent).toContain('No hay ubicaciones');
  });

  test('debe mostrar las ubicaciones en la tabla', () => {
    component.locations = [
      {
        id: 1,
        sector: 'Centro',
        cityName: 'Bogotá',
        departmentName: 'Cundinamarca',
      },
      {
        id: 2,
        sector: 'Norte',
        cityName: 'Medellín',
        departmentName: 'Antioquia',
      },
    ];
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    // Debe haber 2 filas (una por cada ubicación)
    expect(rows.length).toBe(2);
    expect(rows[0].nativeElement.textContent).toContain('Centro');
    expect(rows[1].nativeElement.textContent).toContain('Medellín');
  });
});
