import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  public disconnectedSocket = false;
  public authToken;
  public usersList = [];
  public userId;
  public userName;
  public onlineUsersList = [];
  public meetingsList = [];

  constructor(private socketService: SocketService, private cookieService: CookieService,
    private httpService: HttpService, private toastr: ToastrService, private _route: Router) { }

  ngOnInit() {
    this.authToken = this.cookieService.get('authToken');
    this.userId = this.cookieService.get('userId');
    this.userName = this.cookieService.get('userName');
    this.verifyUserEvent();
    this.getAllUsers();
    this.getAllMeetings();
    this.listenOnlineUsers();
  }

  public verifyUserEvent = (): any => {
    console.log('verifyUsercontent');
    this.socketService.verifyUser().subscribe(
      (data) => {
        console.log(data + 'In verify User');
        this.disconnectedSocket = false;
        this.socketService.setUser(this.authToken);
      },
      error => {
        console.log(error);
      });
  }

  public getAllUsers = () => {
    this.httpService.getAllUsers(this.userId).subscribe(
      (data) => {
        if (data['status'] === 200) {
        this.usersList = data['data'];
        } else if (data['status'] === 500 || data['status'] === 404) {
          this._route.navigate(['/error']);
        } else {
            this.toastr.warning(data['message']);
        }
      },
    (err) => {
      this._route.navigate(['/error']);
      });
  }
  public getAllMeetings = () => {
    this.httpService.getAllEvents().subscribe(
      (data) => {
        if (data['status'] === 200) {
        this.meetingsList = data['data'];
        } else if (data['status'] === 500 || data['status'] === 404) {
          this._route.navigate(['/error']);
        } else {
          this.toastr.warning(data['message']);
        }
      },
    (err) => {
      this._route.navigate(['/error']);
    });
  }

  public refreshStatus = () => {
    this.socketService.getOnlineList();

  }

  public openCalendar = (id) => {
    this._route.navigate([`/account/${id}`]);
  }
  public listenOnlineUsers = () => {
    // this.onlineUsersList =[];
    this.socketService.onlineUserList().subscribe(
      (response) => {
        if (response.length > 0) {
          this.onlineUsersList = response;
          console.log(response + 'userslist---------');
          this.usersList.forEach((user) => {
            console.log(user.firstName + user.lastName);
            if (response.indexOf(user.firstName + user.lastName) !== -1) {
              user.isOnline = true;
            } else {
              user.isOnline = false;
            }
          });
        } else {
          this.toastr.warning('No user is online!!');
        }

      });

  }


  public logOut: any = () => {
    this.httpService.logOutFunction()
      .subscribe(resp => {
        if (resp.status === 200) {
          this.cookieService.deleteAll();
          this.socketService.exitSocket();
          this._route.navigate(['/']);
        } else {
          this.toastr.error(resp.message);
        }
      },
        (err) => {
          this.toastr.error(err.error.data.message);
        });
  }


}
