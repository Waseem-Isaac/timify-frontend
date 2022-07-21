import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task , Project, RegisterContext} from '@app/@shared/interfaces';
import { CredentialsService } from '@app/auth';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private _http: HttpClient, private credentialsService: CredentialsService) { }

  getTeam(): Observable<RegisterContext[]>{
    return this._http.get<RegisterContext[]>('users')
  }
}
