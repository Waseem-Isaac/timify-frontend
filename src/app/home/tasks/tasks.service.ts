import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task , Project, PaginatedListResponse} from '@app/@shared/interfaces';
import { CredentialsService } from '@app/auth';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  canPlayTask!: boolean; 
  pageLimit = 12;

  constructor(private _http: HttpClient, private credentialsService: CredentialsService) { }

  calculateTaskPeriod(startTime: Date, endTime: Date = new Date()): {asObject: any, asString: string}{
    const start = moment(startTime);
    const end   = moment(endTime);
    const diff  = end.diff(start);

    if(moment.utc(diff).date() == 1){
      return {
        asObject: moment.duration(diff)['_data'],
        asString: moment.utc(diff).add(600,'milliseconds').format("H:mm:ss")
      } 
    }
    else {
      return {
        asObject: moment.duration(diff)['_data'],
        asString: '00'+(moment.utc(diff).dayOfYear()-1) + ':'+ moment.utc(diff).add(600,'milliseconds').format("H:mm:ss")
      } 
    }
  };

  defineTask(task?: Task): Task{
    return {
      user: this.credentialsService?.credentials?.userId as string, // Get the current user.

      description: task?.description || '-',
      startTime: task?.startTime,
      period: task?.period,
      endTime: task?.endTime,
      project: task!.project,
      ...task
    }
  }

  // getTasks(before: any): Observable<PaginatedListResponse<Task>>{
  //   return this._http.get<PaginatedListResponse<Task>>(`tasks?before=${before}`);
  // }
  getTasks(): Observable<Task[]>{
    return this._http.get<Task[]>('tasks');
  }

  startTask(task: Task){
    return this._http.post<Task>('tasks', task);
  }

  stopTask(task: Task){
    return this._http.put<{message: string, task: Task}>('tasks/'+task?._id, task);
  }

  editTask(task: Task){
    return this._http.put<{message: string, task: Task}>('tasks/'+task?._id, task);
  }

  editManyTasks(tasks: any[]){
    return this._http.put<{message: string, task: Task}>('tasks', {tasks});
  }

  deleteTask(taskId: string){
    return this._http.delete('tasks/'+taskId)
  }

  deleteMultipleTasks(ids: string[]){
    return this._http.request('delete', 'tasks/bulk', { body : {ids}})
  }


  // Add Project
  addProject(project: Project): Observable<{project: Project}>{
    return this._http.post<{project: Project}>('projects', project);
  }

  getProjects(): Observable<Project[]>{
    return this._http.get<Project[]>('projects');
  }

  getAllTasks(page: number): Observable<PaginatedListResponse<Task>>{
    return this._http.get<PaginatedListResponse<Task>>(`tasks/all?page=${page}&limit=${this.pageLimit}`);
  }

  calculateOveralTaskPeriods(tasks :Task[]){
    const totalDurations = tasks.slice(1).reduce((prev, cur) => {
        return prev.add(cur.period);
      },
      moment.duration(tasks[0].period));


   return(moment.utc(totalDurations.asMilliseconds()).format("HH:mm:ss"))
  }

  getProjectById(projects: Project[], id: string){
    return projects?.find(p => p?._id == id);
  }
}
