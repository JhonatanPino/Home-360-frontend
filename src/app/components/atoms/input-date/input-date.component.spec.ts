import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputDateComponent } from './input-date.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { STRING_MESSAGE } from 'src/app/shared/constants/string-message.constants';

describe('InputDateComponent', () => {
  let component: InputDateComponent;
  let fixture: ComponentFixture<InputDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputDateComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDateComponent);
    component = fixture.componentInstance;
    component.label = 'Fecha de nacimiento';
    component.control = new FormControl<Date | null>(null);
    component.max = '2025-12-31';
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el label correctamente', () => {
    const label = fixture.debugElement.query(By.css('.input-date__label'));
    expect(label.nativeElement.textContent).toContain('Fecha de nacimiento');
  });

  it('debe mostrar el mensaje de campo requerido', () => {
    component.control.markAsTouched();
    component.control.setErrors({ required: true });
    fixture.detectChanges();
    expect(component.getErrorMessage()).toBe(STRING_MESSAGE.FIELD_REQUIRED);
  });

  it('debe mostrar el mensaje de mayor de edad si el error está presente', () => {
    component.control.markAsTouched();
    component.control.setErrors({ mayorDeEdadValidator: true });
    fixture.detectChanges();
    expect(component.getErrorMessage()).toBe(STRING_MESSAGE.AGE_REQUIRED);
  });

  it('debe retornar string vacío si no hay error', () => {
    component.control.setErrors(null);
    fixture.detectChanges();
    expect(component.getErrorMessage()).toBe('');
  });

  it('debe asignar un id único en ngOnInit', () => {
    component.ngOnInit();
    expect(component.inputId).toContain('input-date-');
  });
});
