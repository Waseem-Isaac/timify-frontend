import { Component, Input, OnInit } from '@angular/core';
import { Task } from '@app/@shared/interfaces';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {  
  constructor() { }
  @Input() task!: Task;

  ngOnInit(): void {
  }


  play(){

  }

  delete(){
    
  }
}
