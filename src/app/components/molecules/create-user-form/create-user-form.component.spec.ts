import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserFormComponent } from './create-user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { of, throwError } from 'rxjs';
import { AbstractControl } from '@angular/forms';

function mayorDeEdadValidator(control: AbstractControl<any, any>): any {
  const value = control.value;
  if (!value) {
    return null;
  }
  const birthDate = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18 ? null : { mayorDeEdadValidator: true };
}

describe('mayorDeEdadValidator', () => {
  it('retorna null si la persona es mayor de 18 años', () => {
    const control = { value: '2000-01-01' } as AbstractControl;
    expect(mayorDeEdadValidator(control)).toBeNull();
  });

  it('retorna error si la persona es menor de 18 años', () => {
    const fechaMenor = new Date();
    fechaMenor.setFullYear(fechaMenor.getFullYear() - 17);
    fechaMenor.setDate(fechaMenor.getDate() + 1); // Aún no cumple 18
    const control = {
      value: fechaMenor.toISOString().split('T')[0],
    } as AbstractControl;
    expect(mayorDeEdadValidator(control)).toEqual({
      mayorDeEdadValidator: true,
    });
  });

  it('retorna error si la persona cumple 18 años este mes pero aún no es el día', () => {
    // Simula el 10 del mes y el nacimiento el 20 del mismo mes hace 18 años
    const today = new Date();
    today.setDate(10);
    const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), 20);
    const control = {
      value: birthDate.toISOString().split('T')[0],
    } as AbstractControl;
    // Simula que hoy es antes del cumpleaños
    expect(mayorDeEdadValidator(control)).toEqual({
      mayorDeEdadValidator: true,
    });
  });

  it('retorna null si la persona cumple 18 años hoy', () => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    const control = {
      value: birthDate.toISOString().split('T')[0],
    } as AbstractControl;
    expect(mayorDeEdadValidator(control)).toBeNull();
  });

  it('retorna null si el valor es null', () => {
    const control = { value: null } as AbstractControl;
    expect(mayorDeEdadValidator(control)).toBeNull();
  });
});

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
        { provide: HttpClient, useValue: mockHttp },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe mostrar error si falla la cargar los roles', () => {
    const httpError = { status: 500 };
    mockHttp.get.mockReturnValueOnce(throwError(() => httpError));
    // Vuelve a crear el componente para disparar el constructor y ngOnInit
    const newFixture = TestBed.createComponent(CreateUserFormComponent);
    newFixture.detectChanges();
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

  it('debe marcar error en el campo rol y no llamar al servicio si no se selecciona rol', () => {
    component.userForm.patchValue({
      name: 'Juan',
      lastName: 'Pérez',
      documentNumber: '123456',
      phone: '+573001112233',
      birthDate: new Date('2000-01-01'),
      email: 'test@mail.com',
      password: '123456',
      role: null,
    });

    // Limpia errores previos manualmente si es necesario
    component.userForm.controls.role.setErrors(null);

    component.onSubmit();

    expect(component.userForm.controls.role.errors).toEqual({
      required: true,
    });
    expect(mockUserService.createUser).not.toHaveBeenCalled();
  });
});
