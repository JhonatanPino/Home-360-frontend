import { render, screen } from '@testing-library/angular';
import { FooterComponent } from './footer.component';
import { FooterSectionComponent } from '../../molecules/footer-section/footer-section.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('FooterComponent', () => {
  test('debe mostrar los títulos de las secciones', async () => {
    await render(FooterComponent, {
      declarations: [FooterSectionComponent],
      imports: [FontAwesomeModule],
    });

    expect(screen.getByText('Acceso rápido')).toBeTruthy();
    expect(screen.getByText('Contáctanos')).toBeTruthy();
    expect(screen.getByText('Síguenos')).toBeTruthy();
  });

  test('debe mostrar los textos de quickLinks', async () => {
    await render(FooterComponent, {
      declarations: [FooterSectionComponent],
      imports: [FontAwesomeModule],
    });

    expect(screen.getByText('Buscar Propiedades')).toBeTruthy();
    expect(screen.getByText('Publica tu propiedad')).toBeTruthy();
    expect(screen.getByText('Property Management')).toBeTruthy();
  });

  test('debe mostrar los textos de contactInfo', async () => {
    await render(FooterComponent, {
      declarations: [FooterSectionComponent],
      imports: [FontAwesomeModule],
    });

    expect(screen.getByText('1-800-HOGAR360')).toBeTruthy();
    expect(screen.getByText('info@hogar360.com')).toBeTruthy();
    expect(screen.getByText('123 Real Estate Ave')).toBeTruthy();
  });

  test('debe mostrar los iconos de socialLinks', async () => {
    await render(FooterComponent, {
      declarations: [FooterSectionComponent],
      imports: [FontAwesomeModule],
    });

    // Busca los elementos <svg> generados por fa-icon (debería haber 4)
    const icons = screen.getAllByTestId('fa-icon');
    expect(icons.length).toBeGreaterThanOrEqual(4);
  });
});
