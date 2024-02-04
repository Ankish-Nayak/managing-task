import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetailCardComponent } from './dashboard-detail-card.component';

describe('DashboardDetailCardComponent', () => {
  let component: DashboardDetailCardComponent;
  let fixture: ComponentFixture<DashboardDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDetailCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
