import { Component, inject } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-publish-home-page',
  templateUrl: './publish-home-page.component.html',
  styleUrls: ['./publish-home-page.component.scss'],
})
export class PublishHomePageComponent {
  private readonly homeService = inject(HomeService);

  // Add the currentPageSubject property, initialized to page 1 (or another default value)
  private currentPageSubject = new BehaviorSubject<number>(1);

  onHomePublished(): void {
    this.currentPageSubject.next(this.currentPageSubject.getValue());
  }
}
