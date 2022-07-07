import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Project, Task } from '@app/@shared/interfaces';
import { TasksService } from './tasks/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // @ViewChild('add_task_el') add_task_field!: ElementRef<HTMLElement>; 

  quote: string | undefined;
  isLoading = false;
  tasks: Task[] = [];
  isPlaying!: Task | null;
  focus: boolean = false;

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

  onAddProject(project: Project){
    this.tasksService.addProject(project).subscribe(res => {
      console.log('res');
    },err => console.log(err))
  }

  focusAddTaskInput(){
    let input: HTMLInputElement = document.querySelector('#add_task_input') as HTMLInputElement;
    input.classList.add('on-focus')
    input.focus();
  }
}
