import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserDto } from '../../shared/dtos/user-dto.model';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debe llamar a createUser y retornar el usuario creado', () => {
    const userData: UserDto = {
      name: 'Juan',
      lastName: 'Pérez',
      documentNumber: '123456',
      phone: '3001234567',
      birthDate: new Date('2000-01-01'),
      email: 'juan@correo.com',
      password: '123456',
      idRole: 2,
    };

    service.createUser(userData).subscribe((result) => {
      expect(result).toEqual(userData);
    });

    const req = httpMock.expectOne(`${environment.apiUrlUser}users/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush(userData);
  });

  // Si agregas getAllUsers, puedes agregar un test similar aquí
});
