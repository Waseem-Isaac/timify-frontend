import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project, Task } from '@app/@shared/interfaces';
import { Observable, of } from 'rxjs';
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
  @Output() projectAdded$: EventEmitter<Project | any> = new EventEmitter();
  @Input() focus!: boolean;
   
  @Input() projects!: Project[];

  description: string = this.isPlaying?.description || '';
  project: Project | null = this.isPlaying?.project || null;

  showAddProjectInput: boolean = false;
  mode: 'timer' | 'manual' = 'timer';

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
        period: '00:00:00',
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

  addProject(name: string){
    this.projectAdded$.next({name})
    this.showAddProjectInput = false;
  }

  onModeChange(selectedMode: 'timer' | 'manual'){
    console.log(selectedMode);
    this.mode = selectedMode
  }

  manualAdd(){
    alert('Work inporgress yet')    
  }
  
}
