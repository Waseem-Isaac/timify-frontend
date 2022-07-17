import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoizedTaskPerDay, Project, Task } from '@app/@shared/interfaces';
import { Observable } from 'rxjs';
import { TasksService } from './tasks/tasks.service';
import * as _ from 'lodash';
import * as moment from 'moment';

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
  categorizedTasks: CategoizedTaskPerDay[]= [];
  isPlaying!: Task | null;
  focus: boolean = false;

  periodInterval: any;

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getTasks();
  }

  getTasks(){
    this.tasksService.getTasks().pipe().subscribe(res => {
      this.tasks = res;
      this.categroizeTasksPerDay(this.tasks);
    })
  }

  onStartTask(task: any){
    delete task['_id']; // alwayse start a new task with a fresh id .  on Play ,alwayse start new task, for case resume we'll start a new task with the same name ,then tasks will be categoized by their names.

    this.tasksService.startTask(task).pipe().subscribe(res => {
      this.periodInterval = setInterval(() => {
        res['task']['period'] = this.tasksService.calculateTaskPeriod(task?.startTime, task?.endTime);
      }, 1000)
  
      this.isPlaying = res['task'];
    })
  }

  onStopTask(task: any){
    this.tasksService.stopTask(task).pipe().subscribe(res => {
      this.isPlaying = null;
      clearInterval(this.periodInterval);

      // on stop task .. add it to the tasks list.
      this.tasks.unshift(res?.task);
      this.categroizeTasksPerDay(this.tasks);
    })
  }

  onDeleteTask(taskId: string){
    console.log(taskId)
    this.tasksService.deleteTask(taskId).pipe().subscribe(res => {
      this.tasks = this.tasks.filter(t => t._id !== taskId)
      this.categroizeTasksPerDay(this.tasks);
    })
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


  // Helpers
  categroizeTasksPerDay(tasks: Task[]){
    tasks= tasks.map((task: Task) => { return { day: moment(task.endTime).format('D MMM YYYY') ,...task} });
      
    this.categorizedTasks = (
      _(tasks).groupBy('day')
      .map((tasks, day) => ({ day, tasks }))
      .value()
    );
  }
}
