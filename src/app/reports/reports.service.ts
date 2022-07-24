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
}
