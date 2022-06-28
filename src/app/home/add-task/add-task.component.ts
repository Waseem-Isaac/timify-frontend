import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from '../tasks/tasks.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnChanges{
  @Input() isPlaying!: Task;
  @Output() taskStarted$: EventEmitter<Task> = new EventEmitter();
  @Output() taskStopped$: EventEmitter<Task | any> = new EventEmitter();
  description: string = this.isPlaying?.description || '';
  constructor(private tasksService: TasksService) { }

  ngOnChanges(): void {
    this.description = this.isPlaying?.description; 
  }

  start(){  
    this.taskStarted$.next(this.tasksService.defineTask(
      {
        description: this.description || '[No Description]',
        startTime: new Date(),
        period: {hours: 0, minutes: 0, seconds: 0},
        endTime: undefined,
        user: {name: 'Waseem', email: 'waseem@test.test'},
        project: null
      }
    ));
  }


  stop(){
    this.taskStopped$.next(this.tasksService.defineTask({
      ...this.isPlaying,
      period: this.isPlaying.period,
      description: this.description, 
      endTime: new Date()
    }));
  }
}
