import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasModule } from './components/canvas/canvas.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ToolbarModule,
    CanvasModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
