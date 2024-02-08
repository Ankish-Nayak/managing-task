import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertContentModalComponent } from './upsert-content-modal.component';

describe('UpsertContentModalComponent', () => {
  let component: UpsertContentModalComponent;
  let fixture: ComponentFixture<UpsertContentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertContentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpsertContentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
