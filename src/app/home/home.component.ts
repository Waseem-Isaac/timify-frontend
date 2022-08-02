import { Component, OnInit } from '@angular/core';
import { CategoizedTaskPerDay, Project, Task } from '@app/@shared/interfaces';
import { concatMap, finalize } from 'rxjs';
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
  serverErrMsg!: string;
  projects: Project[]= [];
  mode: 'timer' | 'manual' = 'timer';

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.getTasks();
    this.getProjects();
  }

  getTasks(){
    this.isLoading = true;

    this.tasksService.getTasks().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(res => {      
      this.tasks = res;

      // Category tasks per day.
      this.categroizeTasksPerDay(this.tasks);
      this.handleInprogressTask(res);
      
    }, err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }

  getProjects(){
    this.tasksService.getProjects().subscribe(res => {
      this.projects = res;
    }, err => console.log(err))
  }

  handleInprogressTask(res: Task[]){
     // Detect the in-progress task to be continued.
    //  If the task has been played for more than a day, then stop it. by the auto-stop of its day.
     const inProgressTask = res.find(t => !t.endTime);
     if(inProgressTask){      
      if(this.tasksService.calculateTaskPeriod(inProgressTask.startTime).asObject['days']> 0){{
        const endDate = new Date(inProgressTask.startTime).setHours(23, 59, 59);
        return this.onStopTask(inProgressTask, new Date(endDate));
      }}
      return this.playTask(inProgressTask);
     }
     this.tasksService.canPlayTask = !inProgressTask;
  }

  onStartTask(task: any){
    delete task['_id']; // alwayse start a new task with a fresh id .  on Play ,alwayse start new task, for case resume we'll start a new task with the same name ,then tasks will be categoized by their names.

    // When play new task, Stop the previously played one if exists.
    const inProgressTask = this.tasks.find(t => (!t?.endTime));

    // if there is a currenctly inprogress task , just stop it, then start the new one.
    if(inProgressTask) {
      const taskToBeStopped = this.tasksService.defineTask({
        ...inProgressTask,
        endTime: new Date()
      })
      this.tasksService.stopTask(taskToBeStopped).pipe(
        concatMap(() => this.tasksService.startTask(task))
      ).subscribe(res => {
        // play the timer.
        this.playTask(res['task']);
        // appned the stopped task into the tasks list.
        taskToBeStopped._id !== res['task']?._id && this.tasks.unshift(taskToBeStopped);
        // update the raw tasks by new one.
        this.updateTasks(this.tasks, res['task'])
        // re-categorize the tasks with the new one.
        this.categroizeTasksPerDay(this.tasks);
      })
    }else{ // else , start the new task normally.
      this.tasksService.startTask(task).pipe().subscribe(res => {
        this.playTask(res['task']);
        this.updateTasks(this.tasks, res['task'])
        this.categroizeTasksPerDay(this.tasks);
      })
    }
  }

  onAddTaskManually(task: Task){
    this.tasksService.startTask(task).pipe().subscribe(res => {
      const addedTask = res['task'];
      this.isPlaying = null;      
      this.tasksService.canPlayTask = !this.isPlaying;
      clearInterval(this.periodInterval);

      // on Add task manually .. appned the it into the tasks list.
      const projectID= addedTask['project'];

      addedTask['project'] = this.tasksService.getProjectById(this.projects, projectID);
      this.updateTasks(this.tasks, addedTask)
      this.categroizeTasksPerDay(this.tasks);
     
    })
  }

  onStopTask(task: Task, endTime: Date = new Date()){
    task['endTime'] = endTime;
    task['period'] = this.tasksService.calculateTaskPeriod(task?.startTime, task.endTime).asString;

    this.tasksService.stopTask(task).pipe().subscribe(res => {
      this.isPlaying = null;
      this.tasksService.canPlayTask = !this.isPlaying;
      clearInterval(this.periodInterval);

      // on stop task .. appned the it into the tasks list.
      this.updateTasks(this.tasks, res['task'])
      this.categroizeTasksPerDay(this.tasks);
    })
  }
  
  onEditTask(value: any){        
    this.tasksService.editTask(value).pipe(
    ).subscribe(res => {
      this.updateTasks(this.tasks, res['task'])
      this.categroizeTasksPerDay(this.tasks);
    })
  }

  onEditMultipleTasks(value: any[]){
    this.tasksService.editManyTasks(value).pipe(
    ).subscribe((res) => {
      value.forEach(t => {
        this.updateTasks(this.tasks,t)
      });
      
      this.categroizeTasksPerDay(this.tasks);
    })
  }
  

  onDeleteTask(taskId: string){
    this.tasksService.deleteTask(taskId).pipe().subscribe(res => {
      this.tasks = this.tasks.filter(t => t._id !== taskId)
      this.categroizeTasksPerDay(this.tasks);
    })
  }

  onDeleteMultipleTasks(tasksIds: string[]){
    this.tasksService.deleteMultipleTasks(tasksIds).pipe().subscribe(res => {
      
      this.tasks = this.tasks.filter((t: any) => tasksIds.indexOf(t._id) < 0);
      this.categroizeTasksPerDay(this.tasks);
    })
  }

  onAddProject(project: Project){
    this.tasksService.addProject(project).subscribe(res => {
      this.projects.push(res?.project);
    },err => console.log(err))
  }

  // Helpers
  categroizeTasksPerDay(tasks: Task[]){    
    tasks= tasks.map((task: Task) => { 
      return { 
      day: moment(task.endTime).isSame(moment(), 'day') ? 'Today' : moment(task.endTime).format('ddd, D MMM YYYY'),
      ...task
    } });
      
    this.categorizedTasks = (
      _(tasks).groupBy('day')
      .map((tasks, day) => ({ 
        day, 
        tasks: _(tasks).groupBy('description').map((subTasks, description, overalPeriod) => ({
          description, 
          tasks: subTasks.filter(t => !!t.endTime), 
          finishedTasks: subTasks.some(t => !!t.endTime),
          overalPeriod: this.tasksService.calculateOveralTaskPeriods(subTasks)
        }))
        .sort(
          (objA, objB) => {
            return(Number(moment((objB.tasks[0]?.endTime))) - Number(moment((objA.tasks[0]?.endTime))))
        })
        .value() as Task[], 
        finishedTasks: tasks.some(t => !!t.endTime) }))
      .value()
    );

  }

  playTask(task: Task){
    task['period'] = '00:00:00';

    this.periodInterval = setInterval(() => {
      task['period'] = (this.tasksService.calculateTaskPeriod(task?.startTime, task?.endTime  || new Date())).asString;
    }, 1000)

    this.isPlaying = task;
    this.tasksService.canPlayTask = !this.isPlaying;

  }

  focusAddTaskInput(){
    let input: HTMLInputElement = document.querySelector('#add_task_input') as HTMLInputElement;
    input.classList.add('on-focus')
    input.focus();
  }

  updateTasks(tasks: Task[], task: Task){
    for (let index = 0; index < tasks.length; index++) {
      if(tasks[index]._id === task._id){
        tasks[index] = {...tasks[index], ...task};
        return
      }
    }

    tasks.unshift(task)
  }
}
