import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../../shared/models/category.model';
import { environment } from '../../../environments/environment';

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

  it('debe crear una categoría', () => {
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

  it('debe obtener las categorías', () => {
    const dummyCategories: Category[] = [
      { id: 1, name: 'Test1', description: 'Desc1' },
      { id: 2, name: 'Test2', description: 'Desc2' },
    ];

    service.getAllCategories().subscribe((res) => {
      expect(res).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}categories/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });
});
