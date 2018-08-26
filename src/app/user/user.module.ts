import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxSpinnerModule } from 'ngx-spinner';


import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    InternationalPhoneNumberModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    MatIconModule,
    RouterModule.forChild([
      { path: 'forgotPwd', component: ForgotPasswordComponent }
    ])
  ],
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent]
})
export class UserModule { }
