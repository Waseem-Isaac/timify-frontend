import { Component, OnInit } from '@angular/core';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from '@app/home/tasks/tasks.service';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-tasks-report',
  templateUrl: './tasks-report.component.html',
  styleUrls: ['./tasks-report.component.scss', '../reports.component.scss']
})
export class TasksReportComponent implements OnInit {
  // tasks$: Observable<Task[]> = this.tasksService.getAllTasks();
  isLoading = true;
  serverErrMsg!: string;

  tasks: Task[] = [];
  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(){
    this.tasksService.getAllTasks().pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.tasks = res;
    },err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }

}
