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
  topProjects: {name: string, tasksTime: number , totalPriod: string}[]= []
  constructor(public reportsService: ReportsService) { }

  ngOnInit(): void {
    this.getTeam()
  }

  getTeam(){
    this.reportsService.getProjects().pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.projects = res;
      let totaltime= 0;
      this.projects.forEach(p => {
        p['totalPeriod'] = this.reportsService.calculateTaskPeriodByTime(p?.['tasksTime'])?.asString;
        totaltime += p?.['tasksTime'];
      });

      this.calcTime(totaltime);
    },err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }


  calcTime(projectsTime: number){
    this.reportsService.totalConsumedTime$.subscribe(totalTime => {
      let withoutProjectsTime = totalTime - projectsTime;

      this.topProjects = [...this.projects as any, {
        name: 'Without project',
        tasksTime: withoutProjectsTime,
        totalPeriod: this.reportsService.calculateTaskPeriodByTime(withoutProjectsTime).asString
      }].slice(0,4).filter(p => p['tasksTime']> 0).sort((a,b) => b.tasksTime - a.tasksTime);


      this.topProjects.forEach(p => {
        p['width']  = (p?.['tasksTime'], ' - ', totalTime , ' - ' , (p?.['tasksTime'] / totalTime) * 100);
        p['width'] = p['width'] < 1 ?  ++p['width']:  p['width']  
      });
    })
  }

}
