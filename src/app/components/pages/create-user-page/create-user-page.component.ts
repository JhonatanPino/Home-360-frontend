import { Component, inject } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-user-page',
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.scss'],
})
export class CreateUserPageComponent {
  private readonly userService = inject(UserService);

  // Add the currentPageSubject property, initialized to page 1 (or another default value)
  private currentPageSubject = new BehaviorSubject<number>(1);

  onUserCreated(): void {
    this.currentPageSubject.next(this.currentPageSubject.getValue());
  }
}
