import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '@app/@shared/interfaces';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @Input() isPlaying!: Task | any;
  @Output() taskAdded$: EventEmitter<Task> = new EventEmitter();
  @Output() taskStopped$: EventEmitter<Task | any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  start(desc: string){
    const newTask: Task = {
      description: desc,
      start_time: new Date(),
      endTime: undefined,
      user: {name: 'Waseem', email: 'waseem@test.test'},
      project: null
    } 

    this.taskAdded$.next(newTask);
  }
  pause(){}
  stop(){
    this.taskStopped$.next({});
  }

}
