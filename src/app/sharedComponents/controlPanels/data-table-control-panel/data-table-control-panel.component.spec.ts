import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableControlPanelComponent } from './data-table-control-panel.component';

describe('DataTableControlPanelComponent', () => {
  let component: DataTableControlPanelComponent;
  let fixture: ComponentFixture<DataTableControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableControlPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataTableControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
