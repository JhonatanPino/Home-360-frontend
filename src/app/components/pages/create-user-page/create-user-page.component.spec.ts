import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserPageComponent } from './create-user-page.component';
import { UserService } from 'src/app/core/services/user.service';

describe('CreateUserPageComponent', () => {
  let component: CreateUserPageComponent;
  let fixture: ComponentFixture<CreateUserPageComponent>;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = {};
    await TestBed.configureTestingModule({
      declarations: [CreateUserPageComponent],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe reiniciar la página actual al llamar onUserCreated', () => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.onUserCreated();
    expect(spy).toHaveBeenCalledWith(
      component['currentPageSubject'].getValue()
    );
  });
});
