import { Injectable } from '@angular/core';
import { Task } from '@app/@shared/interfaces';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor() { }

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
}
