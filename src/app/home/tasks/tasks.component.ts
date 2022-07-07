import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '@app/@shared/interfaces';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  @Input() tasks: Task[] = [];
  @Output() taskResumed$: EventEmitter<Task> = new EventEmitter();
  @Output() taskDeleted$: EventEmitter<string> = new EventEmitter();

  onTaskResumed(task: any){
    this.taskResumed$.next(task)
  }
  
  onTaskDeleted(taskId: string){
    this.taskDeleted$.next(taskId)
  }
}
