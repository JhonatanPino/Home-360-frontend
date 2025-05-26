import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CreateCategoryFormComponent } from './create-category-form.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { ToastrService } from 'ngx-toastr';

describe('CreateCategoryFormComponent', () => {
  let component: CreateCategoryFormComponent;
  let mockCategoryService: any;
  let mockToastr: any;

  beforeEach(() => {
    mockCategoryService = { createCategory: jest.fn() };
    mockToastr = { success: jest.fn(), warning: jest.fn(), error: jest.fn() };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CreateCategoryFormComponent],
      providers: [
        FormBuilder,
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    });

    component = TestBed.createComponent(
      CreateCategoryFormComponent
    ).componentInstance;
  });

  test('debe marcar el formulario como tocado si es inválido', () => {
    component.categoryForm.patchValue({ name: '', description: '' });
    const markAllAsTouchedSpy = jest.spyOn(
      component.categoryForm,
      'markAllAsTouched'
    );
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  test('debe mostrar toast de éxito y resetear el formulario al crear la categoría', () => {
    component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
    mockCategoryService.createCategory.mockReturnValue(of({}));
    const resetSpy = jest.spyOn(component.categoryForm, 'reset');
    component.onSubmit();
    expect(mockToastr.success).toHaveBeenCalledWith(
      'Categoría creada exitosamente.',
      'Éxito'
    );
    expect(resetSpy).toHaveBeenCalled();
  });

  test('debe mostrar advertencia si la categoría ya existe (error 400)', () => {
    component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
    mockCategoryService.createCategory.mockReturnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'already exists' },
      }))
    );
    component.onSubmit();
    expect(mockToastr.warning).toHaveBeenCalledWith(
      'La categoría ya existe.',
      'Advertencia'
    );
  });

  test('debe mostrar error si la solicitud es inválida (error 400)', () => {
    component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
    mockCategoryService.createCategory.mockReturnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'otro error' },
      }))
    );
    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalledWith(
      'Solicitud inválida, por favor revisa los datos ingresados.',
      'Error'
    );
  });

  test('debe mostrar error de servidor (error 500)', () => {
    component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
    mockCategoryService.createCategory.mockReturnValue(
      throwError(() => ({
        status: 500,
        error: {},
      }))
    );
    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalledWith(
      'Ocurrió un error en el servidor. Intenta más tarde.',
      'Error del servidor'
    );
  });

  test('debe mostrar error inesperado para otros códigos', () => {
    component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
    mockCategoryService.createCategory.mockReturnValue(
      throwError(() => ({
        status: 999,
        error: {},
      }))
    );
    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalledWith(
      'Ocurrió un error inesperado.',
      'Error'
    );
  });
});
