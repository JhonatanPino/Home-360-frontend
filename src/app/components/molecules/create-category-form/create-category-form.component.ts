import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { VALIDATION } from 'src/app/shared/constants/validation.constants';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

@Component({
  selector: 'app-create-category-form',
  templateUrl: './create-category-form.component.html',
  styleUrls: ['./create-category-form.component.scss'],
})
export class CreateCategoryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly toastr = inject(ToastrService);

  categoryForm: FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
  }> = this.fb.group({
    name: this.fb.control<string | null>('', [
      Validators.required,
      Validators.maxLength(VALIDATION.FIELD_NAME_MAX_LENGTH),
    ]),
    description: this.fb.control<string | null>('', [
      Validators.required,
      Validators.maxLength(VALIDATION.FIELD_DESCRIPTION_MAX_LENGTH),
    ]),
  });

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const { name, description } = this.categoryForm.getRawValue();

    const categoryData: Category = {
      name: name!,
      description: description!,
    };

    console.log(STRING_MESSAGE.DATA_SEND, categoryData);

    this.categoryService.createCategory(categoryData).subscribe({
      next: (response) => {
        console.log(STRING_MESSAGE.CATEGORY_CREATED_SUCCESS, response);
        this.toastr.success(
          STRING_MESSAGE.CATEGORY_CREATED_SUCCESS,
          STRING_MESSAGE.SUCCESS
        );
        this.categoryForm.reset();
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
              STRING_MESSAGE.CATEGORY_ALREADY_EXISTS,
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
          console.error(STRING_MESSAGE.CATEGORY_CREATED_ERROR, error);
          this.toastr.error(
            STRING_MESSAGE.UNEXPECTED_ERROR,
            STRING_MESSAGE.ERROR
          );
        }
      },
    });
  }
}
