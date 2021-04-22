import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatTooltipModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
