import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskComponent } from './tasks/task/task.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SharedModule, FlexLayoutModule, MaterialModule, FormsModule, HomeRoutingModule],
  declarations: [HomeComponent, AddTaskComponent, TasksComponent, TaskComponent],
})
export class HomeModule {}
