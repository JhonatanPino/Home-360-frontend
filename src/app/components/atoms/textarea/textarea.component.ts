import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<string | null>;

  textareaId: string = '';

  ngOnInit(): void {
    this.textareaId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'textarea-' + Math.random().toString(36).substring(2, 9);
  }

  getErrorMessage() {
    if (this.control.errors?.['required']) {
      return STRING_MESSAGE.FIELD_REQUIRED;
    }
    return '';
  }
}
