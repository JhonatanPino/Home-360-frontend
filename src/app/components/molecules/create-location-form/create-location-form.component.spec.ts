import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateLocationFormComponent } from './create-location-form.component';
import { LocationService } from 'src/app/core/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { City } from 'src/app/shared/models/city.model';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

describe('CreateLocationFormComponent', () => {
  let component: CreateLocationFormComponent;
  let fixture: ComponentFixture<CreateLocationFormComponent>;
  let mockLocationService: any;
  let mockToastr: any;
  let mockHttp: any;

  beforeEach(() => {
    mockLocationService = {
      createLocation: jest.fn(),
    };
    mockToastr = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    };
    mockHttp = {
      get: jest.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CreateLocationFormComponent],
      providers: [
        { provide: LocationService, useValue: mockLocationService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: HttpClient, useValue: mockHttp },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe mostrar error si falla la carga de ciudades', () => {
    const httpError = { status: 500 };
    mockHttp.get.mockReturnValueOnce(throwError(() => httpError));
    // Vuelve a crear el componente para disparar el constructor
    TestBed.createComponent(CreateLocationFormComponent);
    expect(mockToastr.error).toHaveBeenCalledWith(
      'No se pudieron cargar las ciudades',
      'Error'
    );
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe marcar el formulario como tocado si es inválido', () => {
    const spy = jest.spyOn(component.locationForm, 'markAllAsTouched');
    component.locationForm.controls.sector.setValue('');
    component.locationForm.controls.city.setValue(null);
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('debe marcar error en el campo ciudad y no llamar al servicio si no se selecciona ciudad', () => {
    component.locationForm.controls.sector.setValue('Barrio Norte'); // sector válido
    // Primero pon un valor válido y luego a null para limpiar errores previos
    component.locationForm.controls.city.setValue({
      id: 1,
      name: 'Fake',
      description: '',
      department: null,
      locations: [],
    } as any);
    component.locationForm.controls.city.setValue(null); // ciudad no seleccionada

    // Limpia errores previos manualmente si es necesario
    component.locationForm.controls.city.setErrors(null);

    component.onSubmit();

    expect(component.locationForm.controls.city.errors).toEqual({
      required: true,
    });
    expect(mockLocationService.createLocation).not.toHaveBeenCalled();
  });

  it('no debe mostrar error si el formulario es inválido', () => {
    component.locationForm.controls.sector.setValue(''); // sector inválido
    component.locationForm.controls.city.setValue(null);
    component.onSubmit();
    expect(mockToastr.error).not.toHaveBeenCalled();
  });

  it('debe llamar a createLocation y mostrar success al crear correctamente', () => {
    const city: City = {
      id: 1,
      name: 'Bogotá',
      description: '',
      department: { id: 1, name: 'Cundinamarca', description: '', cities: [] },
      locations: [],
    };
    component.locationForm.controls.sector.setValue('Sector');
    component.locationForm.controls.city.setValue(city);

    mockLocationService.createLocation.mockReturnValue(of({}));

    component.onSubmit();

    expect(mockLocationService.createLocation).toHaveBeenCalledWith({
      sector: 'Sector',
      idCity: 1,
    });
    expect(mockToastr.success).toHaveBeenCalled();
  });

  it('debe mostrar warning si el error es 400 y ya existe', () => {
    const city: City = {
      id: 1,
      name: 'Bogotá',
      description: '',
      department: { id: 1, name: 'Cundinamarca', description: '', cities: [] },
      locations: [],
    };
    component.locationForm.controls.sector.setValue('Sector');
    component.locationForm.controls.city.setValue(city);

    mockLocationService.createLocation.mockReturnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'already exists' },
      }))
    );

    component.onSubmit();
    expect(mockToastr.warning).toHaveBeenCalledWith(
      STRING_MESSAGE.LOCATION_ALREADY_EXISTS,
      STRING_MESSAGE.WARNING
    );
  });

  it('debe mostrar error si el error es 400 y no es de existencia', () => {
    const city: City = {
      id: 1,
      name: 'Bogotá',
      description: '',
      department: { id: 1, name: 'Cundinamarca', description: '', cities: [] },
      locations: [],
    };
    component.locationForm.controls.sector.setValue('Sector');
    component.locationForm.controls.city.setValue(city);

    mockLocationService.createLocation.mockReturnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'invalid data' },
      }))
    );

    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalledWith(
      STRING_MESSAGE.INVALID_DATA,
      STRING_MESSAGE.ERROR
    );
  });

  it('debe mostrar error de servidor si el error es 500', () => {
    const city: City = {
      id: 1,
      name: 'Bogotá',
      description: '',
      department: { id: 1, name: 'Cundinamarca', description: '', cities: [] },
      locations: [],
    };
    component.locationForm.controls.sector.setValue('Sector');
    component.locationForm.controls.city.setValue(city);

    mockLocationService.createLocation.mockReturnValue(
      throwError(() => ({
        status: 500,
        error: {},
      }))
    );

    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalledWith(
      STRING_MESSAGE.SERVER_ERROR_MESSAGE,
      STRING_MESSAGE.SERVER_ERROR
    );
  });

  it('debe mostrar error inesperado para otros códigos', () => {
    const city: City = {
      id: 1,
      name: 'Bogotá',
      description: '',
      department: { id: 1, name: 'Cundinamarca', description: '', cities: [] },
      locations: [],
    };
    component.locationForm.controls.sector.setValue('Sector');
    component.locationForm.controls.city.setValue(city);

    mockLocationService.createLocation.mockReturnValue(
      throwError(() => ({
        status: 403,
        error: {},
      }))
    );

    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalledWith(
      STRING_MESSAGE.UNEXPECTED_ERROR,
      STRING_MESSAGE.ERROR
    );
  });
});
