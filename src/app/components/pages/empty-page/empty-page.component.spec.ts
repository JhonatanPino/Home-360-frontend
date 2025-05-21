import { render, screen } from '@testing-library/angular';
import { EmptyPageComponent } from './empty-page.component';

describe('EmptyPageComponent', () => {
  test('debe mostrar el texto "Esta pagina se encuentra en desarrollo."', async () => {
    await render(EmptyPageComponent);
    expect(
      screen.getByText('Esta pagina se encuentra en desarrollo.')
    ).toBeTruthy();
  });
});
