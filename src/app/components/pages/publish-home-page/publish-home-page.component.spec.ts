import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishHomePageComponent } from './publish-home-page.component';
import { HomeService } from 'src/app/core/services/home.service';

describe('PublishHomePageComponent', () => {
  let component: PublishHomePageComponent;
  let fixture: ComponentFixture<PublishHomePageComponent>;
  let homeServiceMock: any;

  beforeEach(async () => {
    homeServiceMock = {};
    await TestBed.configureTestingModule({
      declarations: [PublishHomePageComponent],
      providers: [{ provide: HomeService, useValue: homeServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe reiniciar la página actual al llamar onHomePublished', () => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onHomePublished();
    expect(spy).toHaveBeenCalledWith(
      component['currentPageSubject'].getValue()
    );
  });
});
