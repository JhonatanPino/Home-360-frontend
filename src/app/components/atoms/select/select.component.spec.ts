import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.label = 'Categoría';
    component.optionLabel = 'name';
    component.options = [
      { id: 1, name: 'Opción 1' },
      { id: 2, name: 'Opción 2' },
    ];
    component.control = new FormControl(null);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe generar un id único en ngOnInit', () => {
    component.ngOnInit();
    expect(component.inputId).toContain('select-');
  });

  it('debe mostrar mensaje de campo requerido', () => {
    component.control.setErrors({ required: true });
    expect(component.getErrorMessage()).toBe('Este campo es requerido');
  });

  it('debe devolver cadena vacía si no hay errores', () => {
    component.control.setErrors(null);
    expect(component.getErrorMessage()).toBe('');
  });
});
