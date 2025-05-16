import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isActive: string = '';

  constructor(private router: Router) {}

  setActive(section: string, route: string) {
    this.isActive = section;
    this.router.navigate([route]);
  }
}
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.scss']
// })
// export class SidebarComponent {
//   isActive: string = '';

//   setActive(section: string) {
//     this.isActive = section;
//   }
// }
