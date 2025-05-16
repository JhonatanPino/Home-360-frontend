import { render, screen, fireEvent } from '@testing-library/angular';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  test('debe renderizar el componente', async () => {
    await render(SidebarComponent, {
      // Si tu template usa routerLink, puedes mockear RouterTestingModule aquí
    });
    expect(screen.getByRole('navigation')).toBeTruthy();
  });

  test('debe activar la sección seleccionada al hacer clic', async () => {
    await render(SidebarComponent);
    // Busca el enlace de Categorías (ajusta el texto si es diferente)
    const categoriasLink = screen.getByText('Categorías');
    fireEvent.click(categoriasLink);
    // Verifica que la clase active se haya aplicado al ítem
    expect(categoriasLink.closest('li')).toHaveClass('active');
  });
});
