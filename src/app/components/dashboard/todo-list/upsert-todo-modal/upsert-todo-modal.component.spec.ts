import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTodoModalComponent } from './upsert-todo-modal.component';

describe('UpsertTodoModalComponent', () => {
  let component: UpsertTodoModalComponent;
  let fixture: ComponentFixture<UpsertTodoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertTodoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpsertTodoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
