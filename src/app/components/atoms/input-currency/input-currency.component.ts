import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

@Component({
  selector: 'app-input-currency',
  templateUrl: './input-currency.component.html',
  styleUrls: ['./input-currency.component.scss'],
})
export class InputCurrencyComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<number | null>;
  @Input() min: number = 0;
  @Input() max: number = 100000000000;
  @Input() required: boolean = false;
  inputId: string = '';

  get displayValue(): string {
    const value = this.control.value;
    return value != null ? this.formatCurrency(value) : '';
  }

  formatCurrency(value: number | string): string {
    // Puedes ajustar el formato según tu país
    return Number(value).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    });
  }

  ngOnInit(): void {
    this.inputId = this.generateUniqueId();
  }
  private generateUniqueId(): string {
    return 'input-currency-' + Math.random().toString(36).substring(2, 9);
  }
  getErrorMessage() {
    if (this.control.errors?.['required'] && this.required) {
      return STRING_MESSAGE.FIELD_REQUIRED;
    }
    if (this.control.errors?.['min']) {
      return `El valor debe ser al menos ${this.formatCurrency(this.min)}`;
    }
    if (this.control.errors?.['max']) {
      return `El valor no debe exceder ${this.formatCurrency(this.max)}`;
    }
    return '';
  }
}
