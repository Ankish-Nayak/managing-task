import { Component } from '@angular/core';
import { DatePickerComponent } from '../../sharedComponents/datePickers/date-picker/date-picker.component';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { TimePickerComponent } from '../../sharedComponents/timePickers/time-picker/time-picker.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [DatePickerComponent, JsonPipe, TimePickerComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  selectedTime!: NgbTimeStruct;
  selectedDate!: NgbDateStruct;
  constructor() {}
  onDateChange(updatedDate: NgbDateStruct) {
    this.selectedDate = updatedDate;
  }
  onTimeChange(updatedTime: NgbTimeStruct) {
    this.selectedTime = updatedTime;
  }
}
