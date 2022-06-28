import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from '../tasks/tasks.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @Input() isPlaying!: Task;
  @Output() taskStarted$: EventEmitter<Task> = new EventEmitter();
  @Output() taskStopped$: EventEmitter<Task | any> = new EventEmitter();
  description: string = '';
  periodInterval: any;
  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {  }

  start(){
    /**
     * - task started 
     * - task period begin calculating.
     * - task added
     */
    this.periodInterval = setInterval(() => {
      this.isPlaying['period'] = this.tasksService.calculateTaskPeriod(this.isPlaying?.startTime, this.isPlaying.endTime);
    }, 1000)

    const task: Task = {
      description: this.description || '-',
      startTime: new Date(),
      period: {hours: 0, minutes: 0, seconds: 0},
      endTime: undefined,
      user: {name: 'Waseem', email: 'waseem@test.test'},
      project: null
    } 

    this.taskStarted$.next(task);
  }


  stop(){
     /**
     * - task stopped.
     * - task updated (endTime - description - project) if any changed.
     */
    clearInterval(this.periodInterval);

    this.isPlaying.endTime = new Date();
    this.isPlaying.description = this.description;

    this.taskStopped$.next(this.isPlaying);
  }

}
