import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCategoryPageComponent } from './components/pages/create-category-page/create-category-page.component';
import { EmptyPageComponent } from './components/pages/empty-page/empty-page.component';
import { CreateLocationPageComponent } from './components/pages/create-location-page/create-location-page.component';

const routes: Routes = [
  { path: 'categories', component: CreateCategoryPageComponent },
  { path: 'locations', component: CreateLocationPageComponent },

  { path: '', redirectTo: '/categories', pathMatch: 'full' },
  { path: '**', component: EmptyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
