import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoizedTaskPerDay, Project, Task } from '@app/@shared/interfaces';
import { finalize, Observable } from 'rxjs';
import { TasksService } from './tasks/tasks.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // To-do: destroy the subscription onDestroy.

  quote: string | undefined;
  isLoading = false;
  tasks: Task[] = [];
  categorizedTasks: CategoizedTaskPerDay[]= [];
  isPlaying!: Task | null | undefined;
  focus: boolean = false;

  periodInterval: any;

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.getTasks();
  }

  getTasks(){
    this.isLoading = true;

    this.tasksService.getTasks().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      this.tasks = res;

      // Category tasks per day.
      this.categroizeTasksPerDay(this.tasks);
     
      // Detect the in-progress task to be continued.
      const inProgressTask = res.find(t => !t.endTime);
      inProgressTask && this.playTask(inProgressTask);
    })
  }

  onStartTask(task: any){
    delete task['_id']; // alwayse start a new task with a fresh id .  on Play ,alwayse start new task, for case resume we'll start a new task with the same name ,then tasks will be categoized by their names.

    this.tasksService.startTask(task).pipe().subscribe(res => {
      this.playTask(res['task']);

      this.tasks.unshift(res['task']);
      this.categroizeTasksPerDay(this.tasks);

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
    this.tasksService.deleteTask(taskId).pipe().subscribe(res => {
      this.tasks = this.tasks.filter(t => t._id !== taskId)
      this.categroizeTasksPerDay(this.tasks);
    })
  }

  onAddProject(project: Project){
    this.tasksService.addProject(project).subscribe(res => {
    },err => console.log(err))
  }

  // Helpers
  categroizeTasksPerDay(tasks: Task[]){
    tasks= tasks.map((task: Task) => { return { 
      day: moment(task.endTime).diff(moment(), 'days') ?  moment(task.endTime).format('ddd, D MMM YYYY'): 'Today' ,
      ...task
    } });
      
    this.categorizedTasks = (
      _(tasks).groupBy('day')
      .map((tasks, day) => ({ 
        day, 
        tasks: _(tasks).groupBy('description').map((subTasks, description) => ({
          description, tasks: subTasks.filter(t => !!t.endTime) , finishedTasks: subTasks.some(t => !!t.endTime) 
        })).value() as Task[], 
        finishedTasks: tasks.some(t => !!t.endTime) }))
      .value()
    );
  }

  playTask(task: Task){
    this.periodInterval = setInterval(() => {
      task['period'] = this.tasksService.calculateTaskPeriod(task?.startTime, task?.endTime  || new Date());
    }, 1000)

    this.isPlaying = task;
  }

  focusAddTaskInput(){
    let input: HTMLInputElement = document.querySelector('#add_task_input') as HTMLInputElement;
    input.classList.add('on-focus')
    input.focus();
  }
}
