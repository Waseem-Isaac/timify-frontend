import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FormsModule } from '@angular/forms';
import { TasksReportComponent } from './tasks-report/tasks-report.component';
import { TeamReportComponent } from './team-report/team-report.component';
import { ProjectsReportComponent } from './projects-report/projects-report.component';
import { SharedModule } from '@app/@shared';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@NgModule({
  imports: [CommonModule,  FormsModule,FlexLayoutModule, MaterialModule, SharedModule,ReportsRoutingModule],
  declarations: [ReportsComponent, TasksReportComponent, TeamReportComponent, ProjectsReportComponent, TaskDialogComponent],
})
export class ReportsModule {}
