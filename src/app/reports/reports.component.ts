import { Component, OnInit } from '@angular/core';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from '@app/home/tasks/tasks.service';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  version: string | null = environment.version;
  reportPerWhat: string = 'tasks';
  tasks$: Observable<Task[]> = this.tasksService.getAllTasks();

  constructor(private tasksService: TasksService) {}

  ngOnInit() {}

  getTasks(){
    // this.isLoading = true;

    // this.tasksService.getTasks()
    // .pipe(
    //   finalize(() => this.isLoading = false)
    // )
    // .subscribe(res => {
    //   this.tasks = res;

    //   // Category tasks per day.
    //   this.categroizeTasksPerDay(this.tasks);
     
    //   // Detect the in-progress task to be continued.
    //   const inProgressTask = res.find(t => !t.endTime);
    //   inProgressTask && this.playTask(inProgressTask);
    //   this.tasksService.canPlayTask = !!inProgressTask;
    // }, err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }
}
