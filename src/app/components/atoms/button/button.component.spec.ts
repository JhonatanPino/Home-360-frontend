import { render, screen } from '@testing-library/angular';
import { ButtonComponent } from './button.component';
import '@testing-library/jest-dom';

describe('ButtonComponent', () => {
  test('debe mostrar el label recibido por @Input', async () => {
    await render(ButtonComponent, {
      componentProperties: { label: 'Guardar' },
    });
    expect(screen.getByText('Guardar')).toBeTruthy();
  });

  test('debe tener el tipo de botón por defecto como "button"', async () => {
    await render(ButtonComponent);
    const button = screen.getByRole('button');
    expect(button.getAttribute('type')).toBe('button');
  });

  test('debe aceptar el tipo "submit" cuando se pasa por @Input', async () => {
    await render(ButtonComponent, {
      componentProperties: { type: 'submit' },
    });
    const button = screen.getByRole('button');
    expect(button.getAttribute('type')).toBe('submit');
  });
});
