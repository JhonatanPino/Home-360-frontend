// import { CreateCategoryFormComponent } from './create-category-form.component';
// import { FormBuilder } from '@angular/forms';
// import * as ngCore from '@angular/core';
// import { of, throwError } from 'rxjs';

// describe('CreateCategoryFormComponent', () => {
//   let component: CreateCategoryFormComponent;
//   let mockCategoryService: any;
//   let mockToastr: any;
//   let mockFormBuilder: any;

//   beforeEach(() => {
//     jest.restoreAllMocks();

//     mockFormBuilder = new FormBuilder();
//     mockCategoryService = { createCategory: jest.fn() };
//     mockToastr = { success: jest.fn(), warning: jest.fn(), error: jest.fn() };

//     jest.spyOn(ngCore, 'inject').mockImplementation((token: any) => {
//       if (token.name === 'FormBuilder') return mockFormBuilder;
//       if (token.name === 'CategoryService') return mockCategoryService;
//       if (token.name === 'ToastrService') return mockToastr;
//       throw new Error('Servicio no mockeado: ' + token);
//     });

//     component = new CreateCategoryFormComponent();
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it('debe marcar el formulario como tocado si es inválido', () => {
//     component.categoryForm.patchValue({ name: '', description: '' });
//     const markAllAsTouchedSpy = jest.spyOn(
//       component.categoryForm,
//       'markAllAsTouched'
//     );
//     component.onSubmit();
//     expect(markAllAsTouchedSpy).toHaveBeenCalled();
//   });

//   it('debe mostrar toast de éxito y resetear el formulario al crear la categoría', () => {
//     component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
//     mockCategoryService.createCategory.mockReturnValue(of({}));
//     const resetSpy = jest.spyOn(component.categoryForm, 'reset');
//     component.onSubmit();
//     expect(mockToastr.success).toHaveBeenCalledWith(
//       'Categoría creada exitosamente.',
//       'Éxito'
//     );
//     expect(resetSpy).toHaveBeenCalled();
//   });

//   it('debe mostrar advertencia si la categoría ya existe (error 400)', () => {
//     component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
//     mockCategoryService.createCategory.mockReturnValue(
//       throwError(() => ({
//         status: 400,
//         error: { message: 'already exists' },
//       }))
//     );
//     component.onSubmit();
//     expect(mockToastr.warning).toHaveBeenCalledWith(
//       'La categoría ya existe.',
//       'Advertencia'
//     );
//   });

//   it('debe mostrar error si la solicitud es inválida (error 400)', () => {
//     component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
//     mockCategoryService.createCategory.mockReturnValue(
//       throwError(() => ({
//         status: 400,
//         error: { message: 'otro error' },
//       }))
//     );
//     component.onSubmit();
//     expect(mockToastr.error).toHaveBeenCalledWith(
//       'Solicitud inválida, por favor revisa los datos ingresados.',
//       'Error'
//     );
//   });

//   it('debe mostrar error de servidor (error 500)', () => {
//     component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
//     mockCategoryService.createCategory.mockReturnValue(
//       throwError(() => ({
//         status: 500,
//         error: {},
//       }))
//     );
//     component.onSubmit();
//     expect(mockToastr.error).toHaveBeenCalledWith(
//       'Ocurrió un error en el servidor. Intenta más tarde.',
//       'Error del Servidor'
//     );
//   });

//   it('debe mostrar error inesperado para otros códigos', () => {
//     component.categoryForm.patchValue({ name: 'Test', description: 'Desc' });
//     mockCategoryService.createCategory.mockReturnValue(
//       throwError(() => ({
//         status: 999,
//         error: {},
//       }))
//     );
//     component.onSubmit();
//     expect(mockToastr.error).toHaveBeenCalledWith(
//       'Ocurrió un error inesperado.',
//       'Error'
//     );
//   });
// });
