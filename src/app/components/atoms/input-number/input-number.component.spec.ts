import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputNumberComponent } from './input-number.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('InputNumberComponent', () => {
  let component: InputNumberComponent;
  let fixture: ComponentFixture<InputNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputNumberComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputNumberComponent);
    component = fixture.componentInstance;
    component.label = 'Número';
    component.placeholder = 'Ingrese un número';
    component.min = 1;
    component.max = 10;
    component.control = new FormControl(null);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe generar un id único en ngOnInit', () => {
    component.ngOnInit();
    expect(component.inputId).toContain('input-number-');
  });

  it('debe mostrar mensaje de campo requerido', () => {
    component.control.setErrors({ required: true });
    expect(component.getErrorMessage()).toBe('Este campo es requerido');
  });

  it('debe mostrar mensaje de valor mínimo', () => {
    component.control.setErrors({ min: true });
    expect(component.getErrorMessage()).toBe('El valor debe ser al menos 1');
  });

  it('debe mostrar mensaje de valor máximo', () => {
    component.control.setErrors({ max: true });
    expect(component.getErrorMessage()).toBe('El valor no debe exceder 10');
  });

  it('debe devolver cadena vacía si no hay errores', () => {
    component.control.setErrors(null);
    expect(component.getErrorMessage()).toBe('');
  });
});
