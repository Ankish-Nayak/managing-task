import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
  public todo!: Todo;
  public wrapped: boolean = true;
  public canWrap: boolean = false;
  public SHOWN_WORD_COUNT = 100;
  readonly END_POINTS = END_POINTS;
  @Input({ required: true }) id!: string;
  @Output() edit: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodo();
  }

  private getTodo() {
    const todo = JSON.parse(this.todoService.getTodo(this.id.toString()));
    this.todo = todo;
  }
  protected getDescription() {
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
  public toogleWrap() {
    this.wrapped = !this.wrapped;
  }
  public editTodo() {
    this.edit.emit(true);
  }
  ngOnDestroy(): void {}
}
