import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Task } from '@app/@shared/interfaces';
import { TasksService } from '@app/home/tasks/tasks.service';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ReportsService } from './reports.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  version: string | null = environment.version;
  reportPerWhat!: string;

  reportsCounts$: Observable<{tasks: number, projects: number, team: number}> = this.reportsService.countReports(); 

  topTasks$: Observable<any> = this.reportsService.getReportPerTasks();

  constructor(private router: Router, public reportsService: ReportsService) {    
    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
    onNavigationEnd.subscribe(route => {
      this.reportPerWhat = route['urlAfterRedirects'].split('/').pop();
    })
  }

  ngOnInit() {
  }
}
