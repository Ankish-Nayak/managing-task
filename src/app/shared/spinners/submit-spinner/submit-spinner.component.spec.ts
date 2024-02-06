import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSpinnerComponent } from './submit-spinner.component';

describe('SubmitSpinnerComponent', () => {
  let component: SubmitSpinnerComponent;
  let fixture: ComponentFixture<SubmitSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitSpinnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
