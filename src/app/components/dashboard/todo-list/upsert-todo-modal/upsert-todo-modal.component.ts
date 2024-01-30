import { Component, Input, OnInit } from '@angular/core';
import { UpsertTodoComponent } from '../../upsert-todo/upsert-todo.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upsert-todo-modal',
  standalone: true,
  imports: [UpsertTodoComponent],
  templateUrl: './upsert-todo-modal.component.html',
  styleUrl: './upsert-todo-modal.component.scss',
})
export class UpsertTodoModalComponent implements OnInit {
  @Input() update!: boolean;
  @Input() id!: string;
  constructor(private modal: NgbActiveModal) {}
  ngOnInit(): void {
    console.log(this.update, this.id);
  }
  closeModal() {
    this.modal.close();
  }
  dismissModal() {
    this.modal.dismiss();
  }
}
