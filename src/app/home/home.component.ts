import { Component, OnInit } from '@angular/core';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from './tasks/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  tasks: Task[] = [];
  isPlaying!: Task | null;

  periodInterval: any;

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.isLoading = true;
  }

  onStartTask(task: any){
    // Calculate period.
    this.periodInterval = setInterval(() => {
      task['period'] = this.tasksService.calculateTaskPeriod(task?.startTime, task?.endTime);
    }, 1000)

    this.isPlaying = task;
  }

  onStopTask(task: any){
    this.isPlaying = null;
    clearInterval(this.periodInterval);
    
    // on stop task .. add it to the tasks list.
    this.tasks.unshift(task);
  }
}
