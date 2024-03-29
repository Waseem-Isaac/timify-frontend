import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  @Input() tasks: Task[] = [];
  @Output() taskResumed$: EventEmitter<Task> = new EventEmitter();
  @Output() taskDeleted$: EventEmitter<string> = new EventEmitter();
  @Output() taskEdited$: EventEmitter<any> = new EventEmitter();
  @Output() multipleTasksEdited$: EventEmitter<any[]> = new EventEmitter();

  @Output() multipleTasksDeleted$: EventEmitter<string[]> = new EventEmitter();

  constructor(public tasksService: TasksService){}
  onTaskResumed(task: any){
    this.taskResumed$.next(task)
  }
  
  onTaskDeleted(taskId: string){
    this.taskDeleted$.next(taskId)
  }

  onTaskEdited(value: any){    
    this.taskEdited$.next(value)
  }

  onMultipleTasksEdited(value: any[]){
    this.multipleTasksEdited$.next(value)
  }
  
  onMultipleTasksDeleted(tasksIds: string[]){
    this.multipleTasksDeleted$.next(tasksIds);
  }

  identifyer = (index:number, item: any) => item.name;

}
