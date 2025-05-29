import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '../../../environments/environment';
import { Category } from '../../shared/models/category.model';
import { PageResult } from '../../shared/models/page-result.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('debe crear una categoría', () => {
    const dummyCategory: Category = {
      id: 1,
      name: 'Test',
      description: 'Desc',
    };
    service.createCategory(dummyCategory).subscribe((res) => {
      expect(res).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}categories/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyCategory);
    req.flush(dummyCategory);
  });

  test('debe obtener todas las categorías con paginación', () => {
    const dummyPage: PageResult<Category> = {
      content: [
        { id: 1, name: 'Cat 1', description: 'Desc 1' },
        { id: 2, name: 'Cat 2', description: 'Desc 2' },
      ],
      totalElements: 2,
      page: 0,
      size: 10,
      orderAsc: true,
      totalPages: 1,
    };

    service.getAllCategories(0, 10, true).subscribe((res) => {
      expect(res).toEqual(dummyPage);
    });

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}categories/`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyPage);
  });

  test('debe obtener todas las categorías con paginación sin datos por defecto', () => {
    const dummyPage: PageResult<Category> = {
      content: [
        { id: 1, name: 'Cat 1', description: 'Desc 1' },
        { id: 2, name: 'Cat 2', description: 'Desc 2' },
      ],
      totalElements: 2,
      page: 0,
      size: 10,
      orderAsc: true,
      totalPages: 1,
    };

    service.getAllCategories().subscribe((res) => {
      expect(res).toEqual(dummyPage);
    });

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}categories/`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyPage);
  });
});
