import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocationDto } from 'src/app/shared/dtos/location-dto.model';
import { LocationService } from 'src/app/core/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { VALIDATION } from 'src/app/shared/constants/validation.constants';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';
import { City } from 'src/app/shared/models/city.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-location-form',
  templateUrl: './create-location-form.component.html',
  styleUrls: ['./create-location-form.component.scss'],
})
export class CreateLocationFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
  private readonly toastr = inject(ToastrService);

  cities: City[] = [];

  constructor(private http: HttpClient) {
    this.http.get<City[]>('assets/jsons/cities.json').subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: () => {
        this.toastr.error(
          STRING_MESSAGE.CITIES_NOT_LOADED,
          STRING_MESSAGE.ERROR
        );
      },
    });
  }

  locationForm: FormGroup<{
    sector: FormControl<string | null>;
    city: FormControl<City | null>;
  }> = this.fb.group({
    sector: this.fb.control<string | null>('', [
      Validators.required,
      Validators.maxLength(VALIDATION.MAX_LENGTH_SECTOR),
    ]),
    city: this.fb.control<City | null>(null, [Validators.required]),
  });

  get selectedCity(): City | null {
    return this.locationForm.get('city')?.value ?? null;
  }

  onSubmit(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    if (!this.selectedCity) {
      this.locationForm.get('city')?.setErrors({ required: true });
      return;
    }

    const { sector } = this.locationForm.getRawValue();
    const locationData: LocationDto = {
      sector: sector!,
      idCity: this.selectedCity.id!,
    };

    console.log(STRING_MESSAGE.DATA_SEND, locationData);

    this.locationService.createLocation(locationData).subscribe({
      next: (response) => {
        console.log(STRING_MESSAGE.LOCATION_CREATED_SUCCESS, response);
        this.toastr.success(
          STRING_MESSAGE.LOCATION_CREATED_SUCCESS,
          STRING_MESSAGE.SUCCESS
        );
        this.locationForm.reset();
      },
      error: (error) => {
        console.log(STRING_MESSAGE.COMPLETE_ERROR, error);
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
              STRING_MESSAGE.LOCATION_ALREADY_EXISTS,
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
          console.error(STRING_MESSAGE.LOCATION_CREATED_ERROR, error);
          this.toastr.error(
            STRING_MESSAGE.UNEXPECTED_ERROR,
            STRING_MESSAGE.ERROR
          );
        }
      },
    });
  }
}
