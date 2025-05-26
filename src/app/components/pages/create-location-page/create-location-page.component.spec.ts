import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLocationPageComponent } from './create-location-page.component';

describe('CreateLocationPageComponent', () => {
  let component: CreateLocationPageComponent;
  let fixture: ComponentFixture<CreateLocationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLocationPageComponent]
    });
    fixture = TestBed.createComponent(CreateLocationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
