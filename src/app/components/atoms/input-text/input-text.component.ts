import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
})
export class InputTextComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<string | null>;
  @Input() showCounter: boolean = true;

  inputId: string = '';

  ngOnInit(): void {
    this.inputId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'input-text-' + Math.random().toString(36).substring(2, 9);
  }

  getErrorMessage() {
    if (this.control.errors?.['required']) {
      return STRING_MESSAGE.FIELD_REQUIRED;
    }
    return '';
  }
}
