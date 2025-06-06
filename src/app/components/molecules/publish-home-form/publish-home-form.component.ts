import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HomeDto } from 'src/app/shared/dtos/home-dto.model';
import { HomeService } from 'src/app/core/services/home.service';
import { ToastrService } from 'ngx-toastr';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';
import { Category } from 'src/app/shared/models/category.model';
import { Location } from 'src/app/shared/models/location.model';
import { HttpClient } from '@angular/common/http';
import { PublicationStatus } from 'src/app/shared/enums/publication-status.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { LocationService } from 'src/app/core/services/location.service';

@Component({
  selector: 'app-publish-home-form',
  templateUrl: './publish-home-form.component.html',
  styleUrls: ['./publish-home-form.component.scss'],
})
export class PublishHomeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly homeService = inject(HomeService);
  private readonly toastr = inject(ToastrService);
  today = new Date().toISOString().split('T')[0];

  categories: Category[] = [];
  locations: Location[] = [];

  constructor(
    private categoryService: CategoryService,
    private locationService: LocationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories(0, 100).subscribe({
      next: (data) => {
        this.categories = data.content;
      },
      error: (error) => {
        // Manejo de error si lo deseas
        this.toastr.error('No se pudieron cargar las categorías', 'Error');
      },
    });

    this.http.get<Location[]>('assets/jsons/locations.json').subscribe({
      next: (data) => {
        this.locations = data;
      },
      error: (error) => {
        this.toastr.error('No se pudieron cargar las ubicaciones', 'Error');
      },
    });
  }

  homeForm: FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    rooms: FormControl<number | null>;
    bathrooms: FormControl<number | null>;
    price: FormControl<number | null>;
    publicationDate: FormControl<Date | null>;
    publicationDateActive: FormControl<Date | null>;
    status: FormControl<PublicationStatus | null>;
    category: FormControl<Category | null>;
    location: FormControl<Location | null>;
  }> = this.fb.group({
    name: this.fb.control<string | null>('', [Validators.required]),
    description: this.fb.control<string | null>('', [Validators.required]),
    rooms: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    bathrooms: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    price: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    publicationDate: this.fb.control<Date | null>(null, [Validators.required]),
    publicationDateActive: this.fb.control<Date | null>(null, [
      Validators.required,
    ]),
    status: this.fb.control<PublicationStatus | null>(null, [
      Validators.required,
    ]),
    category: this.fb.control<Category | null>(null, [Validators.required]),
    location: this.fb.control<Location | null>(null, [Validators.required]),
  });

  get selectedCategory(): Category | null {
    return this.homeForm.get('category')?.value ?? null;
  }
  get selectedLocation(): Location | null {
    return this.homeForm.get('location')?.value ?? null;
  }
  get publicationActiveMaxDate(): string {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 30);
    return fechaLimite.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.homeForm.invalid) {
      this.homeForm.markAllAsTouched();
      return;
    }

    if (!this.selectedCategory) {
      this.homeForm.get('category')?.setErrors({ required: true });
      return;
    }

    if (!this.selectedLocation) {
      this.homeForm.get('location')?.setErrors({ required: true });
      return;
    }

    const {
      name,
      description,
      rooms,
      bathrooms,
      price,
      publicationDateActive,
    } = this.homeForm.getRawValue();

    const fechaActual = new Date();
    const fechaLimite = new Date(fechaActual);
    fechaLimite.setDate(fechaLimite.getDate() + 30);

    if (publicationDateActive! > fechaLimite) {
      this.homeForm.get('publicationDateActive')?.setErrors({ maxDate: true });
      this.toastr.error(
        'La fecha de publicación activa no puede ser mayor a 30 días después de la fecha de publicación.',
        'Error'
      );
      return;
    }

    const homeData: HomeDto = {
      name: name!,
      description: description!,
      rooms: rooms!,
      bathrooms: bathrooms!,
      price: price!,
      publicationDate: fechaActual,
      publicationDateActive: publicationDateActive!,
      idCategory: this.selectedCategory.id!,
      idLocation: this.selectedLocation.id!,
    };

    console.log(STRING_MESSAGE.DATA_SEND, homeData);

    this.homeService.publishHome(homeData).subscribe({
      next: (response) => {
        console.log(STRING_MESSAGE.HOME_PUBLISHED_SUCCESS, response);
        this.toastr.success(
          STRING_MESSAGE.HOME_PUBLISHED_SUCCESS,
          STRING_MESSAGE.SUCCESS
        );
        this.homeForm.reset();
      },
      error: (error) => {
        console.error(STRING_MESSAGE.COMPLETE_ERROR, error);
        let errorMessage = '';
        if (error?.error) {
          errorMessage =
            error?.error?.message ??
            error?.error?.mensaje ??
            STRING_MESSAGE.UNKNOWN_ERROR;
        }

        if (error.status === 400) {
          if (
            errorMessage.toLowerCase().includes(STRING_MESSAGE.EXISTS) ||
            errorMessage.toLowerCase().includes(STRING_MESSAGE.ALREADY)
          ) {
            console.error();
            this.toastr.warning(
              STRING_MESSAGE.HOME_ALREADY_EXISTS,
              STRING_MESSAGE.WARNING
            );
          } else {
            console.error(STRING_MESSAGE.INVALID_REQUEST, error);
            this.toastr.error(
              STRING_MESSAGE.INVALID_DATA,
              STRING_MESSAGE.ERROR
            );
          }
        } else if (error.status === 500) {
          console.error(STRING_MESSAGE.INTERNAL_SERVER_ERROR, error);
          this.toastr.error(
            STRING_MESSAGE.SERVER_ERROR_MESSAGE,
            STRING_MESSAGE.SERVER_ERROR
          );
        } else {
          console.error(STRING_MESSAGE.HOME_PUBLISHED_ERROR, error);
          this.toastr.error(
            STRING_MESSAGE.UNEXPECTED_ERROR,
            STRING_MESSAGE.ERROR
          );
        }
      },
    });
  }
}
