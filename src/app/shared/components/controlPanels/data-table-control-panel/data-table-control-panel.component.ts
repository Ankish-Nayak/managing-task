import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../../../utils/constants';

@Component({
  selector: 'app-data-table-control-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table-control-panel.component.html',
  styleUrl: './data-table-control-panel.component.scss',
})
export class DataTableControlPanelComponent {
  readonly UserRole = UserRole;
  @Input() isLoading: boolean = false;
  @Input({ required: true }) userType!: UserRole;
  @Input() createRowLabel: string = 'Create Row';
  @Input() searchBox: string = '';
  @Input() isSearchBoxDisabled: boolean = true;
  @Input() searchBoxPlaceholder: string = 'Search rows here';
  @Output() createRow: EventEmitter<void> = new EventEmitter();
  @Output() searchBoxChange = new EventEmitter<string>();
  public onCreateRow() {
    this.createRow.emit();
  }
  public onSearch(e?: KeyboardEvent) {
    if (!e || (e && e.key === 'Enter')) {
      this.searchBoxChange.emit(this.searchBox);
    }
  }
}
