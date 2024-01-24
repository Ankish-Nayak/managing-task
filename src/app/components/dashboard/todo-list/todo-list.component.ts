import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { Todo } from '../../../shared/models/todo.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  todoForm!: FormGroup;
  todos!: Todo[];
  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.getTodos();
    this.todoFormInit();
  }
  todoFormInit() {
    this.todoForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      employeeId: new FormControl(''),
    });
  }
  ngAfterViewInit(): void {}
  getTodos() {
    this.isLoading = true;
    this.todoService.getTodos().subscribe(
      (res) => {
        console.log(res);
        this.todos = res;
        this.isLoading = false;
      },
      (e) => {
        this.isLoading = false;
        console.log(e);
      },
    );
  }
  updateTodo(id: number) {
    const todo = this.todos.find((todo) => todo.id === id);
    localStorage.setItem(`todo/${id}`, JSON.stringify(todo));
    this.router.navigate([`../update-todo/${id}`], { relativeTo: this.route });
  }
  deleteTodo(id: number) {}
}
