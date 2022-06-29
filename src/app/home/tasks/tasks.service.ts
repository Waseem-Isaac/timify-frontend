import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task , Project} from '@app/@shared/interfaces';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private _http: HttpClient) { }

  calculateTaskPeriod(startTime: Date, endTime: Date = new Date()){
    return moment.duration(Math.ceil(moment(endTime).diff(moment(startTime))))['_data'];
  };

  defineTask(task?: Task): Task{
    return {
      description: task?.description || '-',
      startTime: task?.startTime,
      period: task?.period,
      endTime: task?.endTime,
      user: {name: 'Waseem', email: 'waseem@test.test'},
      project: task!.project,
      ...task
    }
  }


  // Add Project
  addProject(project: Project): Observable<Project>{
    return this._http.post<Project>('projects', project);
  }

  getProjects(): Observable<Project[]>{
    return this._http.get<Project[]>('projects');
  }
}
