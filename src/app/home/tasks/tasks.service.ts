import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor() { }

  calculateTaskPeriod(startTime: Date, endTime: Date = new Date()){
    return moment.duration(Math.ceil(moment(endTime).diff(moment(startTime))))['_data'];
  };
}
