import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project, Task } from '@app/@shared/interfaces';
import { Observable, of } from 'rxjs';
import { TasksService } from '../tasks/tasks.service';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnChanges{
  @Input() isPlaying!: Task;
  @Output() taskStarted$: EventEmitter<Task> = new EventEmitter();
  @Output() taskStopped$: EventEmitter<Task | any> = new EventEmitter();
  @Output() projectAdded$: EventEmitter<Project | any> = new EventEmitter();
  @Input() focus!: boolean;

  projects$: Observable<Project[]> = this.tasksService.getProjects();
   
  description: string = this.isPlaying?.description || '';
  project: Project | null = this.isPlaying?.project || null;
  constructor(public tasksService: TasksService, public dialog: MatDialog) { }

  ngOnChanges(): void {
    this.description = this.isPlaying?.description; 
    this.project = this.isPlaying?.project; 
  }

  start(){  
    this.taskStarted$.next(this.tasksService.defineTask(
      {
        description: this.description || '[No Description]',
        startTime: new Date(),
        period: {hours: 0, minutes: 0, seconds: 0},
        endTime: undefined,
        project: this.project
      }
    ));
  }


  stop(){
    this.taskStopped$.next(this.tasksService.defineTask({
      ...this.isPlaying,
      period: this.isPlaying.period,
      description: this.description, 
      project: this.project,
      endTime: new Date()
    }));
  }

  addProject(){
    // console.log('Create new project')
    // this.projectAdded$.next({name: 'inital project'})

      const dialogRef = this.dialog.open(AddProjectDialogComponent, {
        data: {project: this.project},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // this.project = result;
        console.log(result)
      });
  }
}
