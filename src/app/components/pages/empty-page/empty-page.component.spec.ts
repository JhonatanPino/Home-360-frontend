import { render, screen } from '@testing-library/angular';
import { EmptyPageComponent } from './empty-page.component';

describe('EmptyPageComponent', () => {
  test('debe mostrar el texto "empty-page works!"', async () => {
    await render(EmptyPageComponent);
    expect(screen.getByText('empty-page works!')).toBeTruthy();
  });
});
