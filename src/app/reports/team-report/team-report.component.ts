import { Component, OnInit } from '@angular/core';
import { RegisterContext } from '@app/@shared/interfaces';
import { TeamService } from '@app/team/team.service';
import { finalize, map, Observable } from 'rxjs';

@Component({
  selector: 'app-team-report',
  templateUrl: './team-report.component.html',
  styleUrls: ['./team-report.component.scss', '../reports.component.scss']
})
export class TeamReportComponent implements OnInit {
  isLoading = true;
  serverErrMsg!: string;

  team: RegisterContext[] = [];

  constructor(public teamService: TeamService) { }

  ngOnInit(): void {
    this.getTeam()
  }

  getTeam(){
    this.teamService.getTeam().pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.team = res;
    },err =>  this.serverErrMsg = err?.error?.message || 'Something went wrong, Please try again later.')
  }
}
