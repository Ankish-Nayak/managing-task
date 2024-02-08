import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoDetailComponent } from '../../../components/dashboard/todo-list/todo-detail/todo-detail.component';

@Component({
  selector: 'app-content-modal',
  standalone: true,
  imports: [TodoDetailComponent],
  templateUrl: './content-modal.component.html',
  styleUrl: './content-modal.component.scss',
})
export class ContentModalComponent {
  @Input({ required: true }) id!: number;
  constructor(private modalService: NgbActiveModal) {}
  dismissModal() {
    this.modalService.close();
  }
}
