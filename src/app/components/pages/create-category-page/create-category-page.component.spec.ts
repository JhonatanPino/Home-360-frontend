import { render } from '@testing-library/angular';
import { CreateCategoryPageComponent } from './create-category-page.component';

describe('CreateCategoryPageComponent', () => {
  it('debe crearse correctamente', async () => {
    const { fixture } = await render(CreateCategoryPageComponent);
    expect(fixture.componentInstance).toBeInstanceOf(
      CreateCategoryPageComponent
    );
  });
});
