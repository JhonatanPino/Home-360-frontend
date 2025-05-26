import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarWrapperComponent } from './components/organisms/navbar-wrapper/navbar-wrapper.component';
import { InputTextComponent } from './components/atoms/input-text/input-text.component';
import { TextareaComponent } from './components/atoms/textarea/textarea.component';
import { ButtonComponent } from './components/atoms/button/button.component';
import { CreateCategoryFormComponent } from './components/molecules/create-category-form/create-category-form.component';
import { CreateCategoryPageComponent } from './components/pages/create-category-page/create-category-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { SidebarComponent } from './components/organisms/sidebar/sidebar.component';
import { FooterComponent } from './components/organisms/footer/footer.component';
import { FooterSectionComponent } from './components/molecules/footer-section/footer-section.component';
import { EmptyPageComponent } from './components/pages/empty-page/empty-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoriesTableComponent } from './components/molecules/categories-table/categories-table.component';
import { PaginationComponent } from './components/molecules/pagination/pagination.component';
import { CreateLocationFormComponent } from './components/molecules/create-location-form/create-location-form.component';
import { CreateLocationPageComponent } from './components/pages/create-location-page/create-location-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarWrapperComponent,
    InputTextComponent,
    TextareaComponent,
    ButtonComponent,
    CreateCategoryFormComponent,
    CreateCategoryPageComponent,
    SidebarComponent,
    FooterComponent,
    FooterSectionComponent,
    EmptyPageComponent,
    CategoriesTableComponent,
    PaginationComponent,
    CreateLocationFormComponent,
    CreateLocationPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
