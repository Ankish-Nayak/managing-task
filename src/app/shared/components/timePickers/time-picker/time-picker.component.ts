import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimeStruct, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [NgbTimepickerModule, FormsModule, JsonPipe],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
})
export class TimePickerComponent {
  @Input() time: NgbTimeStruct = { hour: 2, minute: 30, second: 0 };
  meridian = true;
  @Output() timeChange = new EventEmitter<NgbTimeStruct>();
  constructor() {}
  ngOnInit(): void {
    this.time = this.getCurrentDate();
  }
  public getCurrentDate() {
    const currentDate = new Date();
    return {
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes(),
      second: currentDate.getSeconds(),
    };
  }
  public onTimeChange() {
    this.timeChange.emit({
      ...this.time,
      second: 0,
    });
  }
}
