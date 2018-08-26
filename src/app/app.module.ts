import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpService } from './http.service';
import { CookieService } from 'ngx-cookie-service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
// import { FlatpickrModule } from 'angularx-flatpickr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxSpinnerModule } from 'ngx-spinner';


import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './user/login/login.component';
import { UserModule } from './user/user.module';
import { SignupComponent } from './user/signup/signup.component';
import { MeetingModule } from './meeting/meeting.module';
import { ErrorPageComponent } from './meeting/error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    InternationalPhoneNumberModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    UserModule,
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    MeetingModule,
    NgxSpinnerModule,
    // FlatpickrModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'home', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'error', component: ErrorPageComponent},
      { path: '**', component: NotFoundComponent }
    ])
  ],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    InternationalPhoneNumberModule
  ],
  providers: [HttpService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
