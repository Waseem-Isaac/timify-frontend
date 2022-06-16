import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { AuthModule } from '@app/auth';
import { ShellComponent } from './shell.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MaterialModule, AuthModule, RouterModule],
  declarations: [ShellComponent],
})
export class ShellModule {}
