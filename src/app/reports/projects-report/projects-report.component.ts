import { Component, OnInit } from '@angular/core';
import { Project } from '@app/@shared/interfaces';
import { finalize } from 'rxjs';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-projects-report',
  templateUrl: './projects-report.component.html',
  styleUrls: ['./projects-report.component.scss', '../reports.component.scss']
})
export class ProjectsReportComponent implements OnInit {
  isLoading = true;
  serverErrMsg!: string;

  projects: Project[] = [];
  topProjects: Project[]= []
  constructor(public reportsService: ReportsService) { }

  ngOnInit(): void {
    this.getTeam()
  }

  getTeam(){
    this.reportsService.getProjects().pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.projects = res;
      this.projects.forEach(p => {
        p['totalPeriod'] = this.reportsService.calculateTaskPeriodByTime(p?.['tasksTime'])?.asString
      });

      this.topProjects = this.projects.slice(0,4);


    },err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }
}
