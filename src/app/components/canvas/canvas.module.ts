import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CanvasComponent],
  imports: [CommonModule , ReactiveFormsModule, FormsModule],
  exports: [CanvasComponent],
})
export class CanvasModule {}
