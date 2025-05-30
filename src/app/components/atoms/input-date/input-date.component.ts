import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
})
export class InputDateComponent implements OnInit {
  @Input() label: string = '';
  @Input() control!: FormControl<Date | null>;
  @Input() max: string = '';
  inputId: string = '';

  ngOnInit(): void {
    this.inputId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'input-date-' + Math.random().toString(36).substring(2, 9);
  }

  getErrorMessage() {
    if (this.control.errors?.['required']) {
      return STRING_MESSAGE.FIELD_REQUIRED;
    }
    if (this.control.errors?.['mayorDeEdadValidator']) {
      return STRING_MESSAGE.AGE_REQUIRED;
    }
    return '';
  }
}
