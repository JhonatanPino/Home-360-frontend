import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLocationFormComponent } from './create-location-form.component';

describe('CreateLocationFormComponent', () => {
  let component: CreateLocationFormComponent;
  let fixture: ComponentFixture<CreateLocationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLocationFormComponent]
    });
    fixture = TestBed.createComponent(CreateLocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
