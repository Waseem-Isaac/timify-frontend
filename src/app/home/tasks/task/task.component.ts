import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {  
  disablePlaying: boolean = false;
  @Input() task!: Task;
  @Output() taskResumed$: EventEmitter<Task> = new EventEmitter();
  @Output() taskDeleted$: EventEmitter<string> = new EventEmitter();
  @Output() taskEdited$: EventEmitter<any> = new EventEmitter();

  @Output() multipleTasksDeleted$: EventEmitter<string[]> = new EventEmitter();

  constructor(public tasksService: TasksService, private _snackBar: MatSnackBar) { }

  play(task: Task){
    if(!this.tasksService.canPlayTask){
      this._snackBar.open('Please finish the currently playing task in order to play another one', 'Ok', {
        panelClass: ['custom-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      return
    }
    this.taskResumed$.next(this.tasksService.defineTask({
      ...task,
      // Will start a new sub-task from 0.
      startTime: new Date(),
      endTime: undefined,
      period: '00:00:00'
    }))
  }

  delete(id: string){
    this.taskDeleted$.next(id as string)
  }

  deleteMultiple(tasks: Task[]){
    const ids: string[] = tasks.map(t => t._id) as string[];
    this.multipleTasksDeleted$.next(ids);
  }


  // todo.
  edit(task: Task, val: any){
    
    // Logic for update single task.
    if(task?._id){
      console.log('update this tasks directly by :', task._id);
      this.taskEdited$.next({_id: task._id, ...val});
    }

    // Logic for update multiple tasks.
    else {      
      if(task.tasks?.length){
        alert('Feature in progress, Will update \r '+ this.task.tasks.map(t => [{_id: t._id, ...val}]))

        console.log('Update bulk tasks', this.task.tasks.map(t => t._id));
      }
    }    
  }
}
