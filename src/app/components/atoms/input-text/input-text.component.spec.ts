import { render, screen, waitFor } from '@testing-library/angular';
import { InputTextComponent } from './input-text.component';
import {
  ReactiveFormsModule,
  FormControl,
  PatternValidator,
} from '@angular/forms';

describe('InputTextComponent', () => {
  test('debe mostrar el label recibido por @Input', async () => {
    await render(InputTextComponent, {
      imports: [ReactiveFormsModule],
      componentProperties: {
        label: 'Nombre',
        control: new FormControl(''),
      },
    });
    expect(screen.getByText('Nombre')).toBeTruthy();
  });

  test('debe mostrar el placeholder recibido por @Input', async () => {
    await render(InputTextComponent, {
      imports: [ReactiveFormsModule],
      componentProperties: {
        placeholder: 'Escribe tu nombre',
        control: new FormControl(''),
      },
    });
    expect(screen.getByPlaceholderText('Escribe tu nombre')).toBeTruthy();
  });

  test('debe mostrar mensaje de error si el campo es requerido', () => {
    const component = new InputTextComponent();
    component.control = new FormControl('');
    component.control.setErrors({ required: true });

    expect(component.getErrorMessage()).toBe('Este campo es requerido');
  });

  test('debe mostrar mensaje de error si el formato no es valido', () => {
    const component = new InputTextComponent();
    component.control = new FormControl('');
    component.control.setErrors({ pattern: true });

    expect(component.getErrorMessage()).toBe('Formato inválido');
  });

  test('debe mostrar mensaje de error si el email no es valido', () => {
    const component = new InputTextComponent();
    component.control = new FormControl('');
    component.control.setErrors({ email: true });

    expect(component.getErrorMessage()).toBe('Formato inválido');
  });

  test('debe retornar vacío si no hay errores', () => {
    const component = new InputTextComponent();
    component.control = new FormControl('');
    component.control.setErrors(null);

    expect(component.getErrorMessage()).toBe('');
  });
});
