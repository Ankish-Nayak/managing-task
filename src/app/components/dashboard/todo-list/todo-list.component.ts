import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { Todo } from '../../../shared/models/todo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  todos!: Todo[];
  constructor(private todoService: TodoService) {}
  ngOnInit(): void {
    this.getTodos();
  }
  getTodos() {
    this.todoService.getTodos().subscribe((res) => {
      console.log(res);
      this.todos = res;
    });
  }
  updateTodo(id: number) {}
  deleteTodo(id: number) {}
}
