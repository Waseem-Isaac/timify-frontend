import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task , Project} from '@app/@shared/interfaces';
import { CredentialsService } from '@app/auth';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private _http: HttpClient, private credentialsService: CredentialsService) { }

  calculateTaskPeriod(startTime: Date, endTime: Date = new Date()){
    const start = moment(startTime);
    const end   = moment(endTime);
    const diff  = end.diff(start);
    
    return moment.utc(diff).format("HH:mm:ss")
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

  getTasks(): Observable<Task[]>{
    return this._http.get<Task[]>('tasks');
  }

  startTask(task: Task){
    return this._http.post<Task>('tasks', task);
  }

  stopTask(task: Task){
    return this._http.put<{message: string, task: Task}>('tasks/'+task?._id, task);
  }

  deleteTask(taskId: string){
    return this._http.delete('tasks/'+taskId)
  }


  // Add Project
  addProject(project: Project): Observable<Project>{
    return this._http.post<Project>('projects', project);
  }

  getProjects(): Observable<Project[]>{
    return this._http.get<Project[]>('projects');
  }
}
