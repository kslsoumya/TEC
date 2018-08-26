import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpParams, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import * as io from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // public baseUrl = 'http://localhost:3000';
  public baseUrl = 'http://theeventcorp-api.themeanstackpro.com';
  private socket;

  constructor(public _http: HttpClient, private cookieService: CookieService) {
    this.socket = io(this.baseUrl);
  }


  // Events to be listened----


  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      });

    });
  }



  public onlineUserList = (): any => {
    console.log('inside onlineUserList');
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (usersList) => {
        console.log(usersList);
        observer.next(usersList);
      });
    });
    // console.log(subscription);
    // return subscription;
  }

  // public disConnect = (): any => {
  //   return Observable.create((observer) => {
  //     this.socket.on('disconnect', () => {
  //       observer.next();

  //     });
  //   });
  // }

  public newMeeting = (): any => {
    return Observable.create((observer) => {
      this.socket.on('meeting', (data) => {
        observer.next(data);
      });
    });
  }

  public notification = (): any => {
    return Observable.create((observer) => {
      this.socket.on('notification', (data) => {
        observer.next(data);
      });
    });
  }

  public meetingUpdate = (): any => {
    return Observable.create((observer) => {
      this.socket.on('meetingChanged', (data) => {
        observer.next(data);
      });
    });
  }

  public meetingCancel = (): any => {
    return Observable.create((observer) => {
      this.socket.on('meetingCancelled', (data) => {
        observer.next(data);
      });
    });
  }


  // events to be emitted---------
  public setUser: any = (authToken) => {
    // console.log('inside setuser');
    this.socket.emit('set-user', authToken);
  }
  public newUser = (user) => {
    this.socket.emit('userCreated', user);
  }

  public createMeeting = (title, start): any => {
    const obj = {
      title: title,
      start: start
    };
    this.socket.emit('planMeeting', obj);
  }

  public changeMeeting: any = (title) => {
    this.socket.emit('modifyMeeting', title);
  }
  public cancelledMeeting: any = (title) => {
    this.socket.emit('cancelMeeting', title);
  }
  public snoozeMeeting: any = (data) => {
    this.socket.emit('snooze', data);
  }

  public getOnlineList = () => {
    this.socket.emit('refresh');
  }

  public dismissSnooze = (title) => {
    this.socket.emit('cancelSnooze', title);
  }

  public exitSocket: any = () => {
    this.socket.disconnect();
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
