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

  play(){
    this.taskResumed$.next(this.tasksService.defineTask({
      ...this.task,
      // start from 0
      startTime: new Date(),
      endTime: undefined,
      period: {hours: 0, minutes: 0, seconds: 0},
    }))
  }

  delete(){}
}
