import { Component, OnInit } from '@angular/core';
import { RegisterContext } from '@app/@shared/interfaces';
import { finalize, map, Observable } from 'rxjs';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-team-report',
  templateUrl: './team-report.component.html',
  styleUrls: ['./team-report.component.scss', '../reports.component.scss']
})
export class TeamReportComponent implements OnInit {
  isLoading = true;
  serverErrMsg!: string;

  team: RegisterContext[] = [];
  topMembers: RegisterContext[] = [];

  constructor(public reportsService: ReportsService) { }

  ngOnInit(): void {
    this.getTeam()
  }

  getTeam(){
    this.reportsService.getTeam().pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.team = res;
      let totaltime= 0;

      this.team.forEach(member => {
        member['totalPeriod'] = this.reportsService.calculateTaskPeriodByTime(member?.['tasksTime'])?.asString;
        totaltime += member?.['tasksTime'];
      });
      
      // this.topMembers = this.team.slice(0,4);
      this.calcTime()
      
    },err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }

  calcTime(){
    this.reportsService.totalConsumedTime$.subscribe(totalTime => {

      this.topMembers = [...this.team].slice(0,4)


      this.topMembers.forEach(item => {
        item['width'] = (item?.['tasksTime'] / totalTime) * 100;
        item['width'] = item['width'] < 1 ?  ++item['width']:  item['width']  
      });
    })
  }
}
