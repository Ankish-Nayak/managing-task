import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmationModalComponent } from '../../../../shared/components/modals/confirmation-modal/confirmation-modal.component';
import { HighlightDirective } from '../../../../shared/directives/highlight/highlight.directive';
import { ICONS } from '../../../../shared/icons/icons';
import { TEmployee } from '../../../../shared/interfaces/employee.type';
import { IUpdateTodoPostData } from '../../../../shared/interfaces/requests/todo.interface';
import { Todo } from '../../../../shared/models/todo.model';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { TodoService } from '../../../../shared/services/todo/todo.service';
import { UserRole } from '../../../../utils/constants';
import { COLS, TCOLS, TcolsName } from '../cols';
import { TodoTab } from '../todo-list.component';

@Component({
  selector: '[app-todo]',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ConfirmationModalComponent,
    NgbTooltipModule,
    FormsModule,
    HighlightDirective,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit, OnDestroy {
  public readonly UserRole = UserRole;
  public readonly ICONS = ICONS;
  public readonly TodoTab = TodoTab;
  @Input({ required: true }) public todo!: Todo;
  @Input({ required: true }) public sno!: number;
  @Input({ required: true }) public userType!: TEmployee;
  @Input({ required: true }) public isLoading!: boolean;
  @Input({ required: true }) public todoTab!: TodoTab;
  @Output() private deleteTodo = new EventEmitter<number>();
  @Output() private updateTodo = new EventEmitter<number>();
  @Output() private navigateTo = new EventEmitter<number>();
  public highlight: { edit: boolean; delete: boolean } = {
    edit: false,
    delete: false,
  };
  public cols: TCOLS = COLS;
  public deadline!: string;
  public wantToChangeDeadline = false;
  private todoMarkLoading = false;
  private subscriptions: Subscription[] = [];
  constructor(
    private todoService: TodoService,
    private toastService: ToastService,
  ) {}
  ngOnInit(): void {
    this.deadline = this.todo.deadLine!;
  }
  public delete() {
    this.deleteTodo.emit(this.todo.id);
  }
  public getDescription(description: string) {
    return description.length > 115
      ? description.substring(0, 115) + '...'
      : description;
  }
  public update() {
    localStorage.setItem(`todo/${this.todo.id}`, JSON.stringify(this.todo));
    this.updateTodo.emit(this.todo.id);
  }
  public navigate() {
    localStorage.setItem(`todo/${this.todo.id}`, JSON.stringify(this.todo));
    this.navigateTo.emit(this.todo.id);
  }
  public userAllowedToView(colName: TcolsName) {
    const col = this.cols.find((e) => e.name === colName);
    return (
      col !== undefined &&
      (col.notAllowedUsers === null ||
        (col.notAllowedUsers !== null &&
          !col.notAllowedUsers.includes(this.userType)))
    );
  }
  public allowedToView(allowedUsers: TEmployee[]) {
    return allowedUsers.includes(this.userType);
  }
  public mark() {
    this.todoMarkLoading = true;
    const subscription = this.todoService
      .markTodo(this.todo.id, {
        isCompleted: !this.todo.isCompleted,
      })
      .subscribe(() => {
        this.toastService.show('Todo', 'Todo marked as done', 'success', 2000);
        this.todoMarkLoading = false;
        this.todo = {
          ...this.todo,
          isCompleted: !this.todo.isCompleted,
        };
      });
    this.subscriptions.push(subscription);
  }

  public onHighlight(type: 'edit' | 'delete', binary: boolean) {
    if (type === 'edit') {
      this.highlight.edit = binary;
    } else {
      this.highlight.delete = binary;
    }
  }
  public togglewantToChangeDeadline() {
    this.wantToChangeDeadline = !this.wantToChangeDeadline;
  }
  public assignDeadline() {
    this.isLoading = true;
    const data: IUpdateTodoPostData = {
      ...this.todo,
      deadLine: this.deadline,
    };
    const subscription = this.todoService
      .updateTodo(this.todo.id, data)
      .subscribe(() => {
        this.isLoading = false;
        this.todo.deadLine = this.deadline;
      });
    this.subscriptions.push(subscription);
    this.togglewantToChangeDeadline();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
