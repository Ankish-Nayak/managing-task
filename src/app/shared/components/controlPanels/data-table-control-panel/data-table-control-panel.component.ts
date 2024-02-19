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
  @Input() isLoading: boolean = false;
  @Input({ required: true }) userType!: UserRole;
  @Input() createRowLabel: string = 'Create Row';
  @Output() createRow: EventEmitter<void> = new EventEmitter();
  @Input() searchBox: string = '';
  @Output() searchBoxChange = new EventEmitter<string>();
  @Input() isSearchBoxDisabled: boolean = true;
  @Input() searchBoxPlaceholder: string = 'Search rows here';
  readonly UserRole = UserRole;
  ngOnInit(): void {}
  onCreateRow() {
    this.createRow.emit();
  }
  onSearch(e?: KeyboardEvent) {
    if (!e || (e && e.key === 'Enter')) {
      this.searchBoxChange.emit(this.searchBox);
    }
  }
}