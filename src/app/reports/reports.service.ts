import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task, Project, RegisterContext } from '@app/@shared/interfaces';
import { CredentialsService } from '@app/auth';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    constructor(private _http: HttpClient, private credentialsService: CredentialsService) { }

    countReports(): Observable<{tasks: number, projects: number, team: number}> {        
        return this._http.get<{tasks: number, projects: number, team: number}>('reports/count')
    }

    getTeam(): Observable<RegisterContext[]>{
        return this._http.get<RegisterContext[]>('users')
    }

    getProjects(): Observable<Project[]> {        
        return this._http.get<Project[]>('projects/all')
    }

    getTopTasks(){
        return this._http.get<any>('reports/top-tasks')
    }

    getTopMemebers(){
        return this._http.get<any>('reports/top-users')
    }

    getTopProjects(){
      return this._http.get<any>('reports/top-projects')
  }


    calculateTaskPeriodByTime(time: number): {asObject: any, asString: string}{        
        if(moment.utc(time).date() == 1){
          return {
            asObject: moment.duration(time)['_data'],
            asString: moment.utc(time).add(600,'milliseconds').format("H:mm:ss")
          } 
        }
        else {
          return {
            asObject: moment.duration(time)['_data'],
            asString: '00'+(moment.utc(time).dayOfYear()-1) + ':'+ moment.utc(time).add(600,'milliseconds').format("H:mm:ss")
          } 
        }
      };
}
