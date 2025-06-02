import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCategoryPageComponent } from './components/pages/create-category-page/create-category-page.component';
import { EmptyPageComponent } from './components/pages/empty-page/empty-page.component';
import { CreateLocationPageComponent } from './components/pages/create-location-page/create-location-page.component';
import { CreateUserPageComponent } from './components/pages/create-user-page/create-user-page.component';
import { PublishHomePageComponent } from './components/pages/publish-home-page/publish-home-page.component';

const routes: Routes = [
  { path: 'categories', component: CreateCategoryPageComponent },
  { path: 'locations', component: CreateLocationPageComponent },
  { path: 'users', component: CreateUserPageComponent },
  { path: 'homes', component: PublishHomePageComponent },

  { path: '', redirectTo: '/categories', pathMatch: 'full' },
  { path: '**', component: EmptyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
