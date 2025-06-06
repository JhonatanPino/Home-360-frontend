import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() label: string = '';
  @Input() control!: FormControl;
  @Input() options: any[] = [];
  @Input() optionLabel: string = '';
  @Input() optionValue: string = 'id';
  @Input() placeholder: string = 'Selecciona una opción';
  inputId: string = '';

  ngOnInit(): void {
    this.inputId = this.generateUniqueId();
  }
  private generateUniqueId(): string {
    return 'select-' + Math.random().toString(36).substring(2, 9);
  }
  getErrorMessage() {
    if (this.control.errors?.['required']) {
      return STRING_MESSAGE.FIELD_REQUIRED;
    }
    return '';
  }
}
