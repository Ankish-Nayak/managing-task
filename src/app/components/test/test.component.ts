import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Notification } from '../../shared/models/notification.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago/time-ago.pipe';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { DatePickerComponent } from '../../sharedComponents/datePickers/date-picker/date-picker.component';
import { TimePickerComponent } from '../../sharedComponents/timePickers/time-picker/time-picker.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    DatePickerComponent,
    JsonPipe,
    TimePickerComponent,
    CommonModule,
    TimeAgoPipe,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
  notifications!: Notification[];
  constructor(private notificationService: NotificationService) {}
  ngOnInit(): void {
    this.notificationService
      .getNotifications({ isSeen: false })
      .subscribe((res) => {
        console.log(res);
        this.notifications = res;
      });
  }
  markAsRead() {}
}
