import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Pagination, Task } from '@app/@shared/interfaces';
import { TasksService } from '@app/home/tasks/tasks.service';
import { finalize, Observable } from 'rxjs';
import { ReportsService } from '../reports.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

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

  topTasks$: Observable<any> = this.reportsService.getTopTasks();

  constructor(private tasksService: TasksService, private reportsService: ReportsService, public dialog: MatDialog) { }

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

  showTask(data: any){
    const dialogRef = this.dialog.open(TaskDialogComponent, {panelClass: 'custom-task-dialog', width: '100%', data, 
    backdropClass: 'custom-task-dialog-backdrop'
  });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
