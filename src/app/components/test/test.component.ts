import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../sharedComponents/datePickers/date-picker/date-picker.component';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, JsonPipe } from '@angular/common';
import { TimePickerComponent } from '../../sharedComponents/timePickers/time-picker/time-picker.component';
import { NotificationService } from '../../shared/services/notification/notification.service';
import {
  Notification,
  NotificationAdapter,
} from '../../shared/models/notification.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago/time-ago.pipe';

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
    this.notificationService.getNotifications().subscribe((res) => {
      this.notifications = res;
    });
  }
  markAsRead() {}
}
