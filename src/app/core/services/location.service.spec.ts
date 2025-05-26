import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { LocationService } from './location.service';
import { of } from 'rxjs';
import { LocationDto } from '../../shared/dtos/location-dto.model';
import { Location } from '../../shared/models/location.model';
import { PageResult } from '../../shared/models/page-result.model';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const httpClientMock = {
      post: jest.fn(),
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        LocationService,
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });

    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  test('debe crear una ubicación', (done) => {
    const dto: LocationDto = { sector: 'Centro', idCity: 1 };
    const location: Location = {
      id: 1,
      sector: 'Centro',
      city: {
        id: 1,
        name: 'Bogotá',
        description: '',
        department: {
          id: 1,
          name: 'Cundinamarca',
          description: '',
          cities: [],
        },
        locations: [],
      },
    };
    httpMock.post.mockReturnValue(of(location));

    service.createLocation(dto).subscribe((result) => {
      expect(result).toEqual(location);
      expect(httpMock.post).toHaveBeenCalledWith(
        expect.stringContaining('locations/'),
        dto
      );
      done();
    });
  });

  test('debe obtener todas las ubicaciones', (done) => {
    const pageResult: PageResult<Location> = {
      content: [],
      page: 0,
      size: 10,
      orderAsc: true,
      totalElements: 0,
      totalPages: 0,
    };
    httpMock.get.mockReturnValue(of(pageResult));

    service.getAllLocations(0, 10, true).subscribe((result) => {
      expect(result).toEqual(pageResult);
      expect(httpMock.get).toHaveBeenCalledWith(
        expect.stringContaining('locations/'),
        expect.objectContaining({ params: expect.any(Object) })
      );
      done();
    });
  });
});
