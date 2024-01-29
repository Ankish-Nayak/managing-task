import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAllowedUserComponent } from './not-allowed-user.component';

describe('NotAllowedUserComponent', () => {
  let component: NotAllowedUserComponent;
  let fixture: ComponentFixture<NotAllowedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotAllowedUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotAllowedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
