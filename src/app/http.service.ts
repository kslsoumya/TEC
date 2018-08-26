import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpParams, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CalendarEvent } from 'angular-calendar';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // public baseUrl = 'http://localhost:3000';
  public baseUrl = 'http://theeventcorp-api.themeanstackpro.com';

  constructor(public _http: HttpClient, public cookieService: CookieService) { }

  public signUp(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('isAdmin', data.isAdmin);
    return (this._http.post(`${this.baseUrl}/api/v1/users/signup`, params));
  }

  public signIn(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return (this._http.post(`${this.baseUrl}/api/v1/users/login`, params));
  }


  public pwdService = (data) => {
    return this._http.put(`${this.baseUrl}/api/v1/users/forgotPwd`, data);
  }

  public getAllUsers = (id) => {
    return this._http.get(`${this.baseUrl}/api/v1/users/get/all?authToken=${this.cookieService.get('authToken')}&id=${id}`);
  }

  public getAllEvents() {
    return this._http.get(`${this.baseUrl}/api/v1/meetings/get/all?authToken=${this.cookieService.get('authToken')}`);

  }
  public createEvent = (event) => {
    event.authToken = this.cookieService.get('authToken');
    return this._http.post(`${this.baseUrl}/api/v1/meetings/create`, event);
  }
  public updateEvent = (event, id) => {
    event.authToken = this.cookieService.get('authToken');
    return this._http.put(`${this.baseUrl}/api/v1/meetings/update/${id}`, event);
  }
  public deleteEvent = (id) => {
    const obj = {authToken: this.cookieService.get('authToken') };
    return this._http.post(`${this.baseUrl}/api/v1/meetings/cancel/${id}`, obj);
  }

  public logOutFunction(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authToken'));
    return (this._http.post(`${this.baseUrl}/api/v1/users/logout`, params));
  }
  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    } // end condition *if
    console.error(errorMessage);
    return Observable.throw(errorMessage);

  }
}
