import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent implements OnInit {
  @Output() modalChange = new EventEmitter<NgbDateStruct>();
  public today!: NgbDate;
  public model!: NgbDateStruct;
  public date!: { year: number; month: number };
  constructor(private calenderService: NgbCalendar) {}
  ngOnInit(): void {
    this.today = this.calenderService.getToday();
  }
  onModelChange(updatedModel: any) {
    console.log(updatedModel);
    this.model = updatedModel;
    this.modalChange.emit(updatedModel);
  }
}
