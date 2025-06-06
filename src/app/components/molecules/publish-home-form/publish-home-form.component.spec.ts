import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishHomeFormComponent } from './publish-home-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { PublicationStatus } from 'src/app/shared/enums/publication-status.model';
import { HomeService } from 'src/app/core/services/home.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

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
        { provide: HomeService, useValue: homeServiceMock }, // <--- CORREGIDO
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
      publicationDateActive: new Date(),
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
    const spy = jest.spyOn(component['homeService'], 'publishHome');
    component.onSubmit();
    expect(
      component.homeForm.get('category')?.errors?.['required']
    ).toBeTruthy();
    expect(spy).not.toHaveBeenCalled();
  });

  it('no debe enviar si no hay ubicación seleccionada', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: new Date(),
      category: { id: 1, name: 'Casa', description: 'Descrpción casa' },
      location: null,
    });
    const spy = jest.spyOn(component['homeService'], 'publishHome');
    component.onSubmit();
    expect(
      component.homeForm.get('location')?.errors?.['required']
    ).toBeTruthy();
    expect(spy).not.toHaveBeenCalled();
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
      publicationDateActive: fechaInvalida,
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

  it('debe enviar el formulario correctamente si es válido', () => {
    const fechaActual = new Date();
    const fechaValida = new Date(fechaActual);
    fechaValida.setDate(fechaActual.getDate() + 15);

    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: fechaValida,
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

    homeServiceMock.publishHome.mockReturnValue(
      of({ status: PublicationStatus.PUBLISHED })
    );

    component.onSubmit();

    expect(homeServiceMock.publishHome).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Casa',
        description: 'Linda casa',
        rooms: 2,
        bathrooms: 1,
        price: 100000,
        publicationDate: expect.any(Date), // La fecha actual
        publicationDateActive: fechaValida,
        idCategory: 1,
        idLocation: 1,
      })
    );
    expect(toastrServiceMock.success).toHaveBeenCalledWith(
      'Publicación creada exitosamente.',
      'Éxito'
    );
  });

  it('debe manejar error al publicar la casa', () => {
    const fechaActual = new Date();
    const fechaValida = new Date(fechaActual);
    fechaValida.setDate(fechaActual.getDate() + 15);

    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: fechaValida,
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

    homeServiceMock.publishHome.mockReturnValue(
      throwError(() => new Error('Error al publicar la casa'))
    );

    component.onSubmit();

    expect(homeServiceMock.publishHome).toHaveBeenCalled();
    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'Ocurrió un error inesperado.',
      'Error'
    );
  });

  it('debe marcar todos los campos como tocados al enviar un formulario inválido', () => {
    const spy = jest.spyOn(component.homeForm, 'markAllAsTouched');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('debe establecer error requerido en el campo categoría si no hay categoría seleccionada', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: new Date(),
      category: null,
    });
    component.onSubmit();
    expect(component.homeForm.get('category')?.errors).toEqual({
      required: true,
    });
  });

  it('debe establecer error requerido en el campo ubicación si no hay ubicación seleccionada', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: new Date(),
      location: null,
    });
    component.onSubmit();
    expect(component.homeForm.get('location')?.errors).toEqual({
      required: true,
    });
  });

  it('debe establecer error de fecha máxima si la fecha de publicación activa es mayor a 30 días', () => {
    const fechaActual = new Date();
    const fechaInvalida = new Date(fechaActual);
    fechaInvalida.setDate(fechaActual.getDate() + 31);

    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: fechaInvalida,
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
    expect(component.homeForm.get('publicationDateActive')?.errors).toEqual({
      maxDate: true,
    });
  });

  it('debe mostrar error si falla la carga de categorías', () => {
    const categoryService = TestBed.inject(CategoryService);
    // Simula el error ANTES de crear el componente
    jest.spyOn(categoryService, 'getAllCategories').mockReturnValue({
      subscribe: ({ error }: any) => error('error'),
    } as any);

    // Destruye el componente anterior si existe
    fixture.destroy();

    // Crea el componente de nuevo para que se ejecute el constructor con el mock
    fixture = TestBed.createComponent(PublishHomeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'No se pudieron cargar las categorías',
      'Error'
    );
  });

  it('debe mostrar error si falla la carga de ubicaciones', () => {
    const http = TestBed.inject(HttpClient);
    jest.spyOn(http, 'get').mockReturnValue({
      subscribe: ({ error }: any) => error('error'),
    } as any);

    // Destruye el componente anterior si existe
    fixture.destroy();

    // Crea el componente de nuevo para que se ejecute el constructor con el mock
    fixture = TestBed.createComponent(PublishHomeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'No se pudieron cargar las ubicaciones',
      'Error'
    );
  });

  it('debe mostrar warning si el backend responde 400 y el mensaje indica que ya existe', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: new Date(),
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
    jest.spyOn(component['homeService'], 'publishHome').mockReturnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'already exists' },
      }))
    );
    const toastrSpy = jest.spyOn(component['toastr'], 'warning');
    component.onSubmit();
    expect(toastrSpy).toHaveBeenCalled();
  });

  it('debe mostrar error si el backend responde 400 y el mensaje no es de existencia', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: new Date(),
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
    jest.spyOn(component['homeService'], 'publishHome').mockReturnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'invalid data' },
      }))
    );
    const toastrSpy = jest.spyOn(component['toastr'], 'error');
    component.onSubmit();
    expect(toastrSpy).toHaveBeenCalledWith(
      STRING_MESSAGE.INVALID_DATA,
      STRING_MESSAGE.ERROR
    );
  });

  it('debe mostrar error de servidor si el backend responde 500', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: new Date(),
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
    jest.spyOn(component['homeService'], 'publishHome').mockReturnValue(
      throwError(() => ({
        status: 500,
        error: {},
      }))
    );
    const toastrSpy = jest.spyOn(component['toastr'], 'error');
    component.onSubmit();
    expect(toastrSpy).toHaveBeenCalledWith(
      STRING_MESSAGE.SERVER_ERROR_MESSAGE,
      STRING_MESSAGE.SERVER_ERROR
    );
  });

  it('debe mostrar error inesperado si el backend responde con otro status', () => {
    component.homeForm.patchValue({
      name: 'Casa',
      description: 'Linda casa',
      rooms: 2,
      bathrooms: 1,
      price: 100000,
      publicationDateActive: new Date(),
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
    jest.spyOn(component['homeService'], 'publishHome').mockReturnValue(
      throwError(() => ({
        status: 404,
        error: {},
      }))
    );
    const toastrSpy = jest.spyOn(component['toastr'], 'error');
    component.onSubmit();
    expect(toastrSpy).toHaveBeenCalledWith(
      STRING_MESSAGE.UNEXPECTED_ERROR,
      STRING_MESSAGE.ERROR
    );
  });
});
