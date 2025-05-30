import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserFormComponent } from './create-user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { of, throwError } from 'rxjs';

describe('CreateUserFormComponent', () => {
  let component: CreateUserFormComponent;
  let fixture: ComponentFixture<CreateUserFormComponent>;
  let mockUserService: any;
  let mockToastr: any;
  let mockHttp: any;

  beforeEach(async () => {
    mockUserService = {
      createUser: jest.fn(),
    };
    mockToastr = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    };
    mockHttp = {
      get: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [CreateUserFormComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe mostrar error si falla la cargar los roles', () => {
    const httpError = { status: 500 };
    mockHttp.get.mockReturnValueOnce(throwError(() => httpError));
    // Vuelve a crear el componente para disparar el constructor
    TestBed.createComponent(CreateUserFormComponent);
    expect(mockToastr.error).toHaveBeenCalledWith(
      'No se pudieron cargar los roles',
      'Error'
    );
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe marcar todos los campos como tocados si el formulario es inválido', () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.userForm,
      'markAllAsTouched'
    );
    component.userForm.patchValue({ name: '' }); // deja el formulario inválido
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('debe marcar error en el campo role si no hay rol seleccionado', () => {
    component.userForm.patchValue({
      name: 'Juan',
      lastName: 'Pérez',
      documentNumber: '123',
      phone: '123',
      birthDate: new Date('2000-01-01'),
      email: 'a@a.com',
      password: '123',
      role: null,
    });
    component.onSubmit();
    expect(component.userForm.get('role')!.errors).toEqual({ required: true });
  });

  it('debe llamar a userService.createUser y mostrar toastr.success si la creación es exitosa', () => {
    component.userForm.patchValue({
      name: 'Juan',
      lastName: 'Pérez',
      documentNumber: '123',
      phone: '123',
      birthDate: new Date('2000-01-01'),
      email: 'a@a.com',
      password: '123',
      role: { id: 2, name: 'Agente Inmobiliario', users: [] },
    });
    mockUserService.createUser.mockReturnValue(of({}));
    component.onSubmit();
    expect(mockUserService.createUser).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalled();
  });

  it('debe mostrar toastr.warning si el usuario ya existe', () => {
    component.userForm.patchValue({
      name: 'Juan',
      lastName: 'Pérez',
      documentNumber: '123',
      phone: '123',
      birthDate: new Date('2000-01-01'),
      email: 'a@a.com',
      password: '123',
      role: { id: 2, name: 'Agente Inmobiliario', users: [] },
    });
    mockUserService.createUser.mockReturnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'already exists' },
      }))
    );
    component.onSubmit();
    expect(mockToastr.warning).toHaveBeenCalled();
  });

  it('debe mostrar toastr.error para error 400 que no sea usuario existente', () => {
    component.userForm.patchValue({
      name: 'Juan',
      lastName: 'Pérez',
      documentNumber: '123',
      phone: '123',
      birthDate: new Date('2000-01-01'),
      email: 'a@a.com',
      password: '123',
      role: { id: 2, name: 'Agente Inmobiliario', users: [] },
    });
    mockUserService.createUser.mockReturnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'invalid data' },
      }))
    );
    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('debe mostrar toastr.error para error 500', () => {
    component.userForm.patchValue({
      name: 'Juan',
      lastName: 'Pérez',
      documentNumber: '123',
      phone: '123',
      birthDate: new Date('2000-01-01'),
      email: 'a@a.com',
      password: '123',
      role: { id: 2, name: 'Agente Inmobiliario', users: [] },
    });
    mockUserService.createUser.mockReturnValue(
      throwError(() => ({
        status: 500,
        error: { message: 'internal error' },
      }))
    );
    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('debe mostrar toastr.error para error inesperado', () => {
    component.userForm.patchValue({
      name: 'Juan',
      lastName: 'Pérez',
      documentNumber: '123',
      phone: '123',
      birthDate: new Date('2000-01-01'),
      email: 'a@a.com',
      password: '123',
      role: { id: 2, name: 'Agente Inmobiliario', users: [] },
    });
    mockUserService.createUser.mockReturnValue(
      throwError(() => ({
        status: 403,
        error: { message: 'forbidden' },
      }))
    );
    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalled();
  });
});
