import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserDto } from 'src/app/shared/dtos/user-dto.model';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { VALIDATION } from 'src/app/shared/constants/validation.constants';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';
import { Role } from 'src/app/shared/models/role.model';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';

function mayorDeEdadValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const birthDate = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18 ? null : { menorDeEdad: true };
}

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss'],
})
export class CreateUserFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);

  roles: Role[] = [];
  constructor(private http: HttpClient) {
    this.http.get<Role[]>('assets/jsons/roles.json').subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: () => {
        this.toastr.error(
          STRING_MESSAGE.ROLES_NOT_LOADED,
          STRING_MESSAGE.ERROR
        );
      },
    });
  }

  userForm: FormGroup<{
    name: FormControl<string | null>;
    lastName: FormControl<string | null>;
    documentNumber: FormControl<string | null>;
    phone: FormControl<string | null>;
    birthDate: FormControl<Date | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    role: FormControl<Role | null>;
  }> = this.fb.group({
    name: this.fb.control<string | null>('', [Validators.required]),
    lastName: this.fb.control<string | null>('', [Validators.required]),
    documentNumber: this.fb.control<string | null>('', [
      Validators.required,
      Validators.pattern(/^\d+$/), // Solo números
    ]),
    phone: this.fb.control<string | null>('', [
      Validators.required,
      Validators.maxLength(VALIDATION.MAX_LENGTH_PHONE),
      Validators.pattern(/^\+?\d{1,13}$/), // Puede iniciar con + y hasta 13 dígitos
    ]),
    birthDate: this.fb.control<Date | null>(null, [
      Validators.required,
      mayorDeEdadValidator,
    ]),
    email: this.fb.control<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.fb.control<string | null>('', [Validators.required]),
    role: this.fb.control<Role | null>(null, [Validators.required]),
  });

  get selectedRole(): Role | null {
    return this.userForm.get('role')?.value ?? null;
  }
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (!this.selectedRole) {
      this.userForm.get('role')?.setErrors({ required: true });
      return;
    }

    const {
      name,
      lastName,
      documentNumber,
      phone,
      birthDate,
      email,
      password,
    } = this.userForm.getRawValue();
    const userData: UserDto = {
      name: name!,
      lastName: lastName!,
      documentNumber: documentNumber!,
      phone: phone!,
      birthDate: birthDate!,
      email: email!,
      password: password!,
      idRole: this.selectedRole.id!,
    };

    console.log(STRING_MESSAGE.DATA_SEND, userData);

    this.userService.createUser(userData).subscribe({
      next: (response) => {
        console.log(STRING_MESSAGE.USER_CREATED_SUCCESS, response);
        this.toastr.success(
          STRING_MESSAGE.USER_CREATED_SUCCESS,
          STRING_MESSAGE.SUCCESS
        );
        this.userForm.reset();
      },
      error: (error) => {
        console.error(STRING_MESSAGE.COMPLETE_ERROR, error);
        let errorMessage = '';
        if (error?.error) {
          errorMessage =
            error?.error?.message ??
            error?.error?.mensaje ??
            STRING_MESSAGE.UNKNOWN_ERROR;
        }

        if (error.status === 400) {
          if (
            errorMessage.toLowerCase().includes(STRING_MESSAGE.EXISTS) ||
            errorMessage.toLowerCase().includes(STRING_MESSAGE.ALREADY)
          ) {
            console.error();
            this.toastr.warning(
              STRING_MESSAGE.USER_ALREADY_EXISTS,
              STRING_MESSAGE.WARNING
            );
          } else {
            console.error(STRING_MESSAGE.INVALID_REQUEST, error);
            this.toastr.error(
              STRING_MESSAGE.INVALID_DATA,
              STRING_MESSAGE.ERROR
            );
          }
        } else if (error.status === 500) {
          console.error(STRING_MESSAGE.INTERNAL_SERVER_ERROR, error);
          this.toastr.error(
            STRING_MESSAGE.SERVER_ERROR_MESSAGE,
            STRING_MESSAGE.SERVER_ERROR
          );
        } else {
          console.error(STRING_MESSAGE.USER_CREATED_ERROR, error);
          this.toastr.error(
            STRING_MESSAGE.UNEXPECTED_ERROR,
            STRING_MESSAGE.ERROR
          );
        }
      },
    });
  }
}
