import { render, screen } from '@testing-library/angular';
import { TextareaComponent } from './textarea.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('TextareaComponent', () => {
  test('debe mostrar el label recibido por @Input', async () => {
    await render(TextareaComponent, {
      imports: [ReactiveFormsModule],
      componentProperties: {
        label: 'Descripción',
        control: new FormControl(''),
      },
    });
    expect(screen.getByText('Descripción')).toBeTruthy();
  });

  test('debe mostrar el placeholder recibido por @Input', async () => {
    await render(TextareaComponent, {
      imports: [ReactiveFormsModule],
      componentProperties: {
        placeholder: 'Escribe una descripción',
        control: new FormControl(''),
      },
    });
    expect(screen.getByPlaceholderText('Escribe una descripción')).toBeTruthy();
  });

  test('debe mostrar mensaje de error si el campo es requerido', () => {
    const component = new TextareaComponent();
    component.control = new FormControl('');
    component.control.setErrors({ required: true });

    expect(component.getErrorMessage()).toBe('Este campo es requerido');
  });

  test('debe retornar vacío si no hay errores', () => {
    const component = new TextareaComponent();
    component.control = new FormControl('');
    component.control.setErrors(null);

    expect(component.getErrorMessage()).toBe('');
  });
});
