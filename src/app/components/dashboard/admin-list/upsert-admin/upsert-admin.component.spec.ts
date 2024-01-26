import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertAdminComponent } from './upsert-admin.component';

describe('UpsertAdminComponent', () => {
  let component: UpsertAdminComponent;
  let fixture: ComponentFixture<UpsertAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpsertAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
