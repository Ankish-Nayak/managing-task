import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTodoComponent } from './upsert-todo.component';

describe('UpsertTodoComponent', () => {
  let component: UpsertTodoComponent;
  let fixture: ComponentFixture<UpsertTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertTodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpsertTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
