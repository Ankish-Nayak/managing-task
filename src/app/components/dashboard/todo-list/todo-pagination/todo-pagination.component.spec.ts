import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoPaginationComponent } from './todo-pagination.component';

describe('TodoPaginationComponent', () => {
  let component: TodoPaginationComponent;
  let fixture: ComponentFixture<TodoPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoPaginationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
