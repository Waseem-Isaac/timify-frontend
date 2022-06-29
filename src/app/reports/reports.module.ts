import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MaterialModule, ReportsRoutingModule],
  declarations: [ReportsComponent],
})
export class ReportsModule {}
