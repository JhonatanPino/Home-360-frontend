import { TestBed } from '@angular/core/testing';
import { HomeService } from './home.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { HomeDto } from '../../shared/dtos/home-dto.model';

describe('HomeService', () => {
  let service: HomeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService],
    });
    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe hacer POST al endpoint correcto en publishHome', () => {
    const mockHome: HomeDto = {
      // Rellena con los campos requeridos por tu modelo
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDate: new Date(),
      publicationDateActive: new Date(),
      idCategory: 1,
      idLocation: 1,
    };

    service.publishHome(mockHome).subscribe((response) => {
      expect(response).toEqual(mockHome);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}homes/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockHome);

    req.flush(mockHome);
  });
});
