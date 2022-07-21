import { Component, OnInit } from '@angular/core';
import { RegisterContext } from '@app/@shared/interfaces';
import { Observable } from 'rxjs';
import { TeamService } from './team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  team$: Observable<RegisterContext[]> = this.teamService.getTeam();

  constructor(public teamService: TeamService) { }

  ngOnInit(): void {
  }
}
