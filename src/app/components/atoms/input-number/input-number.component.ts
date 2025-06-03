import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
})
export class InputNumberComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<number | null>;
  @Input() min: number = 0;
  @Input() max: number = 100;
  inputId: string = '';

  ngOnInit(): void {
    this.inputId = this.generateUniqueId();
  }
  private generateUniqueId(): string {
    return 'input-number-' + Math.random().toString(36).substring(2, 9);
  }
  getErrorMessage() {
    if (this.control.errors?.['required']) {
      return STRING_MESSAGE.FIELD_REQUIRED;
    }
    if (this.control.errors?.['min']) {
      return `El valor debe ser al menos ${this.min}`;
    }
    if (this.control.errors?.['max']) {
      return `El valor no debe exceder ${this.max}`;
    }
    return '';
  }
}
