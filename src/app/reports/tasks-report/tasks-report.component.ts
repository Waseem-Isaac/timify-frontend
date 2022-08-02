import { Component, OnInit } from '@angular/core';
import { Pagination, Task } from '@app/@shared/interfaces';
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
  page: number = 1;
  pagination: Pagination;

  tasks: Task[] = [];
  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
    this.getTasks(this.page);
  }

  getTasks(page: number){
    this.isLoading = true;
    
    this.tasksService.getAllTasks(page).pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.tasks = [...this.tasks, ...res?.data];
      this.pagination = res?.pagination;
    },err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }


  onScroll() {
    if(this.page < this.pagination.lastPage){
      this.getTasks(++this.page);
    }
  }
}
