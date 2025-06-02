import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishHomeFormComponent } from './publish-home-form.component';

describe('PublishHomeFormComponent', () => {
  let component: PublishHomeFormComponent;
  let fixture: ComponentFixture<PublishHomeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishHomeFormComponent]
    });
    fixture = TestBed.createComponent(PublishHomeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
