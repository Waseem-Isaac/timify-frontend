import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {  
  constructor(private tasksService: TasksService) { }
  @Input() task!: Task;
  @Output() taskResumed$: EventEmitter<Task> = new EventEmitter();
  @Output() taskDeleted$: EventEmitter<string> = new EventEmitter();
  @Output() multipleTasksDeleted$: EventEmitter<string[]> = new EventEmitter();

  play(task: Task){

    this.taskResumed$.next(this.tasksService.defineTask({
      ...task,
      // Will start a new sub-task from 0.
      startTime: new Date(),
      endTime: undefined,
      period: '00:00:00'
    }))
  }

  delete(id: string){
    this.taskDeleted$.next(id as string)
  }

  deleteMultiple(tasks: Task[]){
    const ids: string[] = tasks.map(t => t._id) as string[];
    this.multipleTasksDeleted$.next(ids);
  }
}
