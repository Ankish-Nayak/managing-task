import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-save-changes-modal',
  standalone: true,
  imports: [],
  templateUrl: './save-changes-modal.component.html',
  styleUrl: './save-changes-modal.component.scss',
})
export class SaveChangesModalComponent {
  constructor(private modalService: NgbActiveModal) {}
  public closeModal(confirmation: boolean) {
    this.modalService.close(confirmation);
  }
  public dismissModal() {
    this.modalService.dismiss();
  }
}
