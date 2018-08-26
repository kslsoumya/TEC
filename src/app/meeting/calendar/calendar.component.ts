import { Component, OnInit, ViewChild, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
// import { DayViewHour } from 'calendar-utils';
import {
  startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, startOfMonth,
  startOfWeek, endOfWeek, format
} from 'date-fns';
import { Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';


import { HttpService } from '../../http.service';
import { map } from 'rxjs/operators';
import { SocketService } from '../../socket.service';
import { Router } from '@angular/router';

interface Event {
  start: string;
  end: string;
  color: { primary: string, secondary: string };
  title: string;
}
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})


export class CalendarComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('createModal') createModal: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal: TemplateRef<any>;
  @ViewChild('reminderModal') reminderModal: TemplateRef<any>;
  public view = 'month';
  viewDate: Date = new Date();

  events$: Observable<Array<CalendarEvent<{ event: Event }>>>;


  public date = 'today';
  public title: string;
  public start: Date;
  public end: Date;
  public primaryColor: string;
  public secondaryColor: string;
  public description: string;
  public location: string;
  public userName: String;
  public isAdmin = false;
  activeDayIsOpen = false;
  public cancelEventId: String;
  public cancelEventTitle: String;
  public isChanged = false;
  public isCreate = true;
  public isEdit = false;
  public isSnooze = false;
  public disconnectedSocket = false;
  public modalData: {
    event: CalendarEvent
  };
  public isNotification = false;
  public notification = { data: {} };
  public editableEvent = { event: {} };
  refresh: Subject<any> = new Subject();

  constructor(private httpService: HttpService, private cookieService: CookieService, private modal: NgbModal,
  private toastr: ToastrService, private socketService: SocketService, private _route: Router, private goBack: Location) { }

  ngOnInit(): void {
    this.userName = this.cookieService.get('userName');
    if (this.userName.indexOf('admin') !== -1) {
      this.isAdmin = true;
    } else {
      // this.verifyUserEvent();
      this.listenCancelMeeting();
      this.listenEditMeeting();
      this.listenMeeting();
      this.listenNotification();
    }
    this.fetchEvents();
  }

  // public verifyUserEvent = (): any => {
  //   console.log('verifyUsercontent');
  //   this.socketService.verifyUser().subscribe(
  //     (data) => {
  //       console.log(data + 'In verify User');
  //       this.disconnectedSocket = false;
  //       this.socketService.setUser(this.cookieService.get('authToken'));
  //     },
  //     error => {
  //       console.log(error);
  //     });
  // }

  public goBackToPreviousPage(): any {
    this.goBack.back();
  }

  fetchEvents(): void {
    this.activeDayIsOpen = false;
    this.events$ = this.httpService.getAllEvents()
      .pipe(
        map(({ data }: { data: Event[] }) => {
          if (data !== null) {
            return data.map((event: Event) => {
              if (this.isAdmin) {
                return {
                  title: event.title,
                  start: new Date(event.start),
                  end: new Date(event.end),
                  color: event.color,
                  draggable: true,
                  actions: [
                    {
                      label: '<i class="fa fa-fw fa-edit"></i>',
                      onClick: (): void => {
                        this.editEvent(event);
                      }
                    },
                    {
                      label: '<i class="fa fa-fw fa-times"></i>',
                      onClick: (): void => {
                        this.deleteEvent(event);
                      }
                    }
                  ],
                  meta: {
                    event
                  }
                };
              } else {
                return {
                  title: event.title,
                  start: new Date(event.start),
                  end: new Date(event.end),
                  color: event.color,
                  draggable: false,
                  meta: {
                    event
                  }
                };
              }
            });
          } else {
            this._route.navigate(['/error']);
          }
        })
      );
    // console.log(this.events$);
  }


  dayClicked({
    date,
    events
  }: {
      date: Date;
      events: Array<CalendarEvent<{ event: Event }>>;
    }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        if (this.userName.indexOf('admin') !== -1 && events.length === 0) {
          this.isCreate = true;
          this.isEdit = false;
          this.title = this.description = this.location = this.primaryColor = this.secondaryColor = '';
          this.start = this.end = date;
          this.modal.open(this.createModal, { size: 'lg' });
        }
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ event: Event }>): void {
    this.modalData = { event };
    this.modal.open(this.modalContent, { size: 'lg' });

  }

  addEvent(): void {
    this.isCreate = true;
    this.isEdit = false;
    this.title = this.description = this.location = this.primaryColor = this.secondaryColor = '';
    this.start = this.end = new Date();
    this.modal.open(this.createModal, { size: 'lg' });
  }

  createEvent = () => {
    const event: CalendarEvent = {
      start: this.start,
      end: this.end,
      title: this.title,
      color: { primary: this.primaryColor, secondary: this.secondaryColor }
    };
    const extraData = {
      location: this.location,
      desc: this.description,
      admin: this.userName
    };
    const eventObj = {
      event: event,
      misc: extraData
    };
    // console.log(event);
    this.httpService.createEvent(eventObj).subscribe(
      (data) => {
        // console.log(data);
        if (data['status'] === 200) {
        this.toastr.success('Event added');
        this.socketService.createMeeting(event.title, event.start);
        this.fetchEvents();
        } else if (data['status'] === 500) {
          this._route.navigate(['/error']);
        } else {
            this.toastr.warning(data['message']);
        }
      },
      (err) => {
        console.log(err);
        this._route.navigate(['/error']);
      }
    );
  }

  public listenNotification = () => {
    this.socketService.notification().subscribe(
      (data) => {
        console.log(data);
        this.notification = { data };
        this.modal.open(this.reminderModal, { size: 'sm' });
      });
  }
  public snoozeReminder = () => {
    this.isSnooze = true;
    this.socketService.snoozeMeeting(this.notification.data);
  }

  public dismissSnooze = (title) => {
    this.isSnooze = false;
    this.socketService.dismissSnooze(title);
  }


  editEvent = (event) => {
    this.editableEvent = { event };
    this.isCreate = false;
    this.isEdit = true;
    this.modal.open(this.createModal, { size: 'lg' });
    this.isChanged = false;
    this.title = event.title;
    this.primaryColor = event.color['primary'];
    this.secondaryColor = event.color['secondary'];
    this.location = event.location;
    this.description = event.description;
    this.start = new Date(event.start);
    this.end = new Date(event.end);
  }

  confirmEdit = () => {
    if (this.isChanged) {
      const changedEvent = {
        title: this.title,
        color: { primary: this.primaryColor, secondary: this.secondaryColor },
        location: this.location,
        start: this.start,
        end: this.end
      };
      this.httpService.updateEvent(changedEvent, this.editableEvent.event['meetingId']).subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.toastr.success('Meeting Updated Successfully');
            this.socketService.changeMeeting(this.editableEvent.event['title']);
            this.fetchEvents();
          } else if (response['status'] === 500) {
            this._route.navigate(['/error']);
          } else {
            this.toastr.warning(response['message']);
          }
        },
        (err) => {
          console.log(err);
          this._route.navigate(['/error']);
        });
    } else {
      this.toastr.info('Nothing Changed!!');
    }
  }

  deleteEvent = (event) => {
    this.cancelEventTitle = event.title;
    this.cancelEventId = event.meetingId;
    this.modal.open(this.deleteModal, { size: 'lg' });
  }

  confirmDelete = () => {
    this.httpService.deleteEvent(this.cancelEventId).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.toastr.success('Meeting Cancelled Successfully!!');
          this.socketService.cancelledMeeting(this.cancelEventTitle);
          this.fetchEvents();
        }  else if (response['status'] === 500) {
          this._route.navigate(['/error']);
        } else {
          this.toastr.warning(response['message']);
        }
      },
      (err) => {
        console.log(err);
        this._route.navigate(['/error']);
      });
  }

  private listenMeeting = () => {
    console.log('meeting created');
    this.socketService.newMeeting().subscribe(
      (response) => {
        this.toastr.info(`${response} has been scheduled!!`);
        this.fetchEvents();
      });
  }

  private listenEditMeeting = () => {
    this.socketService.meetingUpdate().subscribe(
      (response) => {
        this.toastr.info(`${response} has been updated!!`);
      });
  }

  private listenCancelMeeting = () => {
    this.socketService.meetingCancel().subscribe(
      (response) => {
        this.toastr.info(`${response} has been Cancelled!!`);
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


