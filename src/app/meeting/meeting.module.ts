
import 'flatpickr/dist/flatpickr.css';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import {MatInputModule} from '@angular/material/input';
import { ColorPickerModule } from 'ngx-color-picker';
import {NgxPaginationModule} from 'ngx-pagination';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
  imports: [
    CommonModule,
    // NgbModalModule.forRoot(),
    FormsModule,
    NgbModule,
    MatInputModule,
    ColorPickerModule,
    NgxPaginationModule,
    FlatpickrModule.forRoot(),
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    NgxSpinnerModule,
    RouterModule.forChild([
      { path: 'account/:userId', component: CalendarComponent},
    { path: 'account/dashBoard/:userId', component: AdminViewComponent}]
    )
  ],
  exports : [
    MatInputModule
  ],
  declarations: [CalendarComponent, AdminViewComponent, ErrorPageComponent]
})
export class MeetingModule { }
