import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListControllerComponent } from './todo-list-controller.component';

describe('TodoListControllerComponent', () => {
  let component: TodoListControllerComponent;
  let fixture: ComponentFixture<TodoListControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListControllerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoListControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
