import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputCurrencyComponent } from './input-currency.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

const STRING_MESSAGE = {
  FIELD_REQUIRED: 'Este campo es requerido',
};

describe('InputCurrencyComponent', () => {
  let component: InputCurrencyComponent;
  let fixture: ComponentFixture<InputCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputCurrencyComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCurrencyComponent);
    component = fixture.componentInstance;
    component.label = 'Precio';
    component.placeholder = 'Ingrese el precio';
    component.min = 1000;
    component.max = 1000000;
    component.required = true;
    component.control = new FormControl(null);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe generar un id único en ngOnInit', () => {
    component.ngOnInit();
    expect(component.inputId).toContain('input-currency-');
  });

  it('debe mostrar mensaje de campo requerido', () => {
    component.control.setErrors({ required: true });
    expect(component.getErrorMessage()).toBe(STRING_MESSAGE.FIELD_REQUIRED);
  });

  it('debe mostrar mensaje de valor mínimo', () => {
    component.control.setErrors({ min: true });
    expect(component.getErrorMessage()).toBe(
      `El valor debe ser al menos ${component.formatCurrency(component.min)}`
    );
  });

  it('debe mostrar mensaje de valor máximo', () => {
    component.control.setErrors({ max: true });
    expect(component.getErrorMessage()).toBe(
      `El valor no debe exceder ${component.formatCurrency(component.max)}`
    );
  });

  it('debe devolver cadena vacía si no hay errores', () => {
    component.control.setErrors(null);
    expect(component.getErrorMessage()).toBe('');
  });

  it('debe formatear correctamente el valor de displayValue', () => {
    component.control.setValue(50000);
    expect(component.displayValue).toBe(component.formatCurrency(50000));
  });

  it('displayValue debe retornar el valor formateado si el control tiene un número', () => {
    component.control.setValue(50000);
    expect(component.displayValue).toBe(component.formatCurrency(50000));
  });

  it('displayValue debe retornar cadena vacía si el control es null', () => {
    component.control.setValue(null);
    expect(component.displayValue).toBe('');
  });
});
