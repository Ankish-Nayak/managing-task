import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TodoService } from '../../../../shared/services/todo/todo.service';
import { Todo } from '../../../../shared/models/todo.model';
import { CommonModule, JsonPipe } from '@angular/common';
import { END_POINTS } from '../../../../utils/constants';

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [JsonPipe, CommonModule, RouterLink],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.scss',
})
export class TodoDetailComponent implements OnInit, OnDestroy {
  todo!: Todo;
  wrapped: boolean = true;
  canWrap: boolean = false;
  SHOWN_WORD_COUNT = 100;
  END_POINTS = END_POINTS;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.getTodo();
  }

  getTodo() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        const todo = JSON.parse(this.todoService.getTodo(id));
        this.todo = todo;
      }
    });
  }
  getDescription() {
    const words = this.todo.description.split(' ');
    this.canWrap = words.length > this.SHOWN_WORD_COUNT;
    if (!this.canWrap) {
      return words.join(' ');
    } else if (this.wrapped === true) {
      const newWords = words.slice(0, this.SHOWN_WORD_COUNT);
      return newWords.join(' ');
    } else {
      return words.join(' ');
    }
  }
  toogleWrap() {
    this.wrapped = !this.wrapped;
  }
  edit() {
    this.router.navigate([`../../update-todo/${this.todo.id}`], {
      relativeTo: this.route,
    });
  }
  ngOnDestroy(): void {}
}
