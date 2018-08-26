import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import { SocketService } from '../../socket.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public password: String;
  public emailId: String;
  public mobile: Number;
  public firstName: String;
  public lastName: String;
  public isAdmin: Boolean  = false;


  constructor(private httpService: HttpService , private toastr: ToastrService, private _router: Router,
  private socketService: SocketService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }
  public createUser: any = () => {
    this.spinner.show();
    const newUser = {
      password: this.password,
      email: this.emailId,
      mobile: this.mobile,
      firstName: this.firstName,
      lastName: this.lastName,
      isAdmin : this.isAdmin
    };
    // console.log(this.mobile + '----' + this.isAdmin);
    this.httpService.signUp(newUser).subscribe(
      (response) => {
        // console.log(response);
        if (response['status'] === 200) {
          this.spinner.hide();
        this.toastr.success('User Created successfully!!');
        this.socketService.newUser(response.data);
        setTimeout(() => {
          this._router.navigate(['/home']);
        });
        } else if (response['status'] === 500) {
          this._router.navigate(['/error']);
        } else {
        this.toastr.warning(response.message);
        }
    },
      (err) => {
        this._router.navigate(['/error']);
      });
  }

}
