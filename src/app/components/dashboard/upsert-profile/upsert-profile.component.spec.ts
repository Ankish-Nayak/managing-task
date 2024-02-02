import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertProfileComponent } from './upsert-profile.component';

describe('UpsertProfileComponent', () => {
  let component: UpsertProfileComponent;
  let fixture: ComponentFixture<UpsertProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpsertProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
