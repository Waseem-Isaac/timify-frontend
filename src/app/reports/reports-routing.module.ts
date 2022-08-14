import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsReportComponent } from './projects-report/projects-report.component';

import { ReportsComponent } from './reports.component';
import { TasksReportComponent } from './tasks-report/tasks-report.component';
import { TeamReportComponent } from './team-report/team-report.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { 
    path: '', component: ReportsComponent, data: { title: 'Report' },
    children: [
      {
        path: 'tasks',
        component: TasksReportComponent
      },
      {
        path: 'team',
        component: TeamReportComponent
      },
      {
        path: 'projects',
        component: ProjectsReportComponent
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
      }
    ]
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ReportsRoutingModule {}
