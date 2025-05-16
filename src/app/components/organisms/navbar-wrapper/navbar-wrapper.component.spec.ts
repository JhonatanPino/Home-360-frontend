import { render, screen } from '@testing-library/angular';
import { NavbarWrapperComponent } from './navbar-wrapper.component';

describe('NavbarWrapperComponent', () => {
  test('debe mostrar el nombre de usuario', async () => {
    await render(NavbarWrapperComponent);
    expect(screen.getByText('Bienvenido, Admin')).toBeTruthy();
  });

  test('debe mostrar el avatar del usuario', async () => {
    await render(NavbarWrapperComponent);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'assets/images/Avatar.jpg');
  });
});
