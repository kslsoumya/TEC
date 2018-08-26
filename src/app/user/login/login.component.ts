import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../../socket.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public hide = true;
  public emailId;
  public password;

  constructor(private httpService: HttpService, private toastr: ToastrService, private _router: Router,
    private cookie: CookieService, private socketService: SocketService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  public loginUser = () => {
    this.spinner.show();
    const userData = {
      email: this.emailId,
      password: this.password
    };
    this.httpService.signIn(userData).subscribe(
      (resp) => {
        // console.log(resp);
        if (resp.status === 200) {
          this.spinner.hide();
          this.toastr.success(resp.message);
          this.cookie.set('authToken', resp.data.authToken);
          this.cookie.set('userId', resp.data.userDetails.userId);
          if (resp.data.userDetails.isAdmin) {
            this.cookie.set('userName', resp.data.userDetails.firstName + '-admin');
            this._router.navigate(['/account/dashBoard/' + resp.data.userDetails.userId]);

          } else {
            this.socketService.setUser(this.cookie.get('authToken'));
            this.cookie.set('userName', resp.data.userDetails.firstName + ' ' + resp.data.userDetails.lastName);
            this._router.navigate(['/account/' + resp.data.userDetails.userId]);
          }
        } else if (resp['status'] === 500) {
          this._router.navigate(['/error']);
        } else {
          this.toastr.warning(resp.message);
        }
      },
      (err) => {
        this._router.navigate(['/error']);
      });

  }

}
