import { render, screen } from '@testing-library/angular';
import { FooterSectionComponent } from './footer-section.component';

describe('FooterSectionComponent', () => {
  test('debe mostrar el título recibido por @Input', async () => {
    await render(FooterSectionComponent, {
      componentProperties: {
        title: 'Contacto',
        items: [],
      },
    });
    expect(screen.getByText('Contacto')).toBeTruthy();
  });

  test('debe mostrar los textos de los testems recibidos por @Input', async () => {
    await render(FooterSectionComponent, {
      componentProperties: {
        title: 'Redes',
        items: [
          { icon: null, text: 'Facebook' },
          { icon: null, text: 'Twitter' },
        ],
      },
    });
    expect(screen.getByText('Facebook')).toBeTruthy();
    expect(screen.getByText('Twitter')).toBeTruthy();
  });

  test('debe manejar items con iconos nulos y textos nulos', async () => {
    await render(FooterSectionComponent, {
      componentProperties: {
        title: 'Redes',
        items: [
          { icon: null, text: null },
          { icon: null, text: 'Instagram' },
        ],
      },
    });
    expect(screen.getByText('Instagram')).toBeTruthy();
  });
});
