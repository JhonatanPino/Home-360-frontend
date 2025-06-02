import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishHomePageComponent } from './publish-home-page.component';

describe('PublishHomePageComponent', () => {
  let component: PublishHomePageComponent;
  let fixture: ComponentFixture<PublishHomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishHomePageComponent]
    });
    fixture = TestBed.createComponent(PublishHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
