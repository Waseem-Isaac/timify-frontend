import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule , NgxMatNativeDateModule} from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule],
  declarations: [LoaderComponent, TruncatePipe],
  exports: [
    LoaderComponent, TruncatePipe,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
})
export class SharedModule {}
