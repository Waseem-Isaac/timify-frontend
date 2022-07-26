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

  constructor(public reportsService: ReportsService) { }

  ngOnInit(): void {
    this.getTeam()
  }

  getTeam(){
    this.reportsService.getTeam().pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.team = res;
    },err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }
}