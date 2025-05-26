import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateLocationPageComponent } from './create-location-page.component';
import { LocationService } from 'src/app/core/services/location.service';
import { of } from 'rxjs';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { Location } from 'src/app/shared/models/location.model';

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

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener ubicaciones al inicializar', (done) => {
    const pageResult: PageResult<Location> = {
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
        0,
        undefined,
        true
      );
      done();
    });
  });

  it('debe cambiar de página al llamar onPageChange', () => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onPageChange(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('debe recargar la página actual al llamar onLocationCreated', () => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onLocationCreated();
    expect(spy).toHaveBeenCalledWith(
      component['currentPageSubject'].getValue()
    );
  });

  it('debe alternar el orden al llamar toggleOrderAsc', () => {
    const spy = jest.spyOn(component['orderAscSubject'], 'next');
    const prevValue = component['orderAscSubject'].getValue();
    component.toggleOrderAsc();
    expect(spy).toHaveBeenCalledWith(!prevValue);
  });
});
