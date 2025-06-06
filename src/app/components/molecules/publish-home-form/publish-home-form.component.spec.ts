import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishHomeFormComponent } from './publish-home-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { PublicationStatus } from 'src/app/shared/enums/publication-status.model';

describe('PublishHomeFormComponent', () => {
  let component: PublishHomeFormComponent;
  let fixture: ComponentFixture<PublishHomeFormComponent>;
  let homeServiceMock: any;
  let toastrServiceMock: any;

  beforeEach(async () => {
    homeServiceMock = {
      publishHome: jest.fn(),
    };
    toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PublishHomeFormComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: 'HomeService', useValue: homeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishHomeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe enviar si el formulario es inválido', () => {
    const spy = jest.spyOn(component, 'onSubmit');
    component.homeForm.patchValue({ name: '' }); // Campo requerido vacío
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(homeServiceMock.publishHome).not.toHaveBeenCalled();
  });

  it('no debe enviar si no hay categoría seleccionada', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDate: new Date(),
      publicationDateActive: new Date(),
      status: PublicationStatus.PUBLISHED,
      category: null,
      location: {
        id: 1,
        sector: 'Barrio',
        city: {
          id: 1,
          name: 'Ciudad',
          description: 'Descripción ciudad',
          department: {
            id: 1,
            name: 'Departamento',
            description: 'Descripción departamento',
            cities: [],
          },
          locations: [],
        },
      },
    });
    component.onSubmit();
    expect(homeServiceMock.publishHome).not.toHaveBeenCalled();
  });
  it('no debe enviar si no hay ubicación seleccionada', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDate: new Date(),
      publicationDateActive: new Date(),
      status: PublicationStatus.PUBLISHED,
      category: { id: 1, name: 'Casa', description: 'Descrpción casa' },
      location: null,
    });
    component.onSubmit();
    expect(homeServiceMock.publishHome).not.toHaveBeenCalled();
  });

  it('debe mostrar error si la fecha de publicación activa es mayor a 30 días', () => {
    const fechaActual = new Date();
    const fechaInvalida = new Date(fechaActual);
    fechaInvalida.setDate(fechaActual.getDate() + 31);

    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDate: fechaActual,
      publicationDateActive: fechaInvalida,
      status: PublicationStatus.PUBLISHED,
      category: { id: 1, name: 'Casa', description: 'Descrpción casa' },
      location: {
        id: 1,
        sector: 'Barrio',
        city: {
          id: 1,
          name: 'Ciudad',
          description: 'Descripción ciudad',
          department: {
            id: 1,
            name: 'Departamento',
            description: 'Descripción departamento',
            cities: [],
          },
          locations: [],
        },
      },
    });

    component.onSubmit();
    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'La fecha de publicación activa no puede ser mayor a 30 días después de la fecha de publicación.',
      'Error'
    );
    expect(homeServiceMock.publishHome).not.toHaveBeenCalled();
  });
});
