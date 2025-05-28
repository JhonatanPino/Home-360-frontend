import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateLocationPageComponent } from './create-location-page.component';
import { LocationService } from 'src/app/core/services/location.service';
import { of } from 'rxjs';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { LocationResponse } from 'src/app/shared/dtos/location-response.model';

describe('CreateLocationPageComponent', () => {
  let component: CreateLocationPageComponent;
  let fixture: ComponentFixture<CreateLocationPageComponent>;
  let mockLocationService: any;

  beforeEach(() => {
    mockLocationService = {
      getAllLocations: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [CreateLocationPageComponent],
      providers: [{ provide: LocationService, useValue: mockLocationService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLocationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  test('debe obtener ubicaciones al inicializar', (done) => {
    const pageResult: PageResult<LocationResponse> = {
      content: [],
      page: 0,
      size: 10,
      orderAsc: true,
      totalElements: 0,
      totalPages: 0,
    };
    mockLocationService.getAllLocations.mockReturnValue(of(pageResult));

    component.locations$.subscribe((result) => {
      expect(result).toEqual(pageResult);
      expect(mockLocationService.getAllLocations).toHaveBeenCalledWith(
        'a',
        0,
        undefined,
        true
      );
      done();
    });
  });

  test('debe cambiar el filtro y reiniciar la página al llamar onFilterChange con texto', () => {
    const filterSpy = jest.spyOn(component['filterSubject'], 'next');
    const pageSpy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onFilterChange('Bogotá');
    expect(filterSpy).toHaveBeenCalledWith('Bogotá');
    expect(pageSpy).toHaveBeenCalledWith(0);
  });

  test('debe poner "*" como filtro si el texto está vacío', () => {
    const filterSpy = jest.spyOn(component['filterSubject'], 'next');
    component.onFilterChange('');
    expect(filterSpy).toHaveBeenCalledWith('*');
  });

  test('debe poner "*" como filtro si el texto es solo espacios', () => {
    const filterSpy = jest.spyOn(component['filterSubject'], 'next');
    component.onFilterChange('   ');
    expect(filterSpy).toHaveBeenCalledWith('*');
  });

  test('debe cambiar de página al llamar onPageChange', () => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onPageChange(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  test('debe recargar la página actual al llamar onLocationCreated', () => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onLocationCreated();
    expect(spy).toHaveBeenCalledWith(
      component['currentPageSubject'].getValue()
    );
  });

  test('debe alternar el orden al llamar toggleOrderAsc', () => {
    const spy = jest.spyOn(component['orderAscSubject'], 'next');
    const prevValue = component['orderAscSubject'].getValue();
    component.toggleOrderAsc();
    expect(spy).toHaveBeenCalledWith(!prevValue);
  });
});
