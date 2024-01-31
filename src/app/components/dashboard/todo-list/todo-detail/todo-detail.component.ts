import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Todo } from '../../../../shared/models/todo.model';
import { TodoService } from '../../../../shared/services/todo/todo.service';
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
  @Input({ required: true }) id!: string;
  @Output() edit: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.getTodo();
  }

  getTodo() {
    const todo = JSON.parse(this.todoService.getTodo(this.id.toString()));
    this.todo = todo;
    // this.route.paramMap.subscribe((params) => {
    //   const id = params.get('id');
    //   if (id !== null) {
    //   }
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
  editTodo() {
    this.edit.emit(true);
    // this.router.navigate([`../../update-todo/${this.todo.id}`], {
    //   relativeTo: this.route,
    // });
  }
  ngOnDestroy(): void {}
}
