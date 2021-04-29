import { Component, HostListener } from '@angular/core';
import { ToolsManagerService } from './services/tools-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pintar';
  constructor(private _tm: ToolsManagerService){}
  @HostListener("document:keydown",["$event"]) onKeyDown(e:KeyboardEvent){
    if(e.ctrlKey && e.key === "z"){
      this._tm.Undo.set(true)
    }
    if(e.ctrlKey && e.key === "y"){
      this._tm.Redo.set(true)
    }
  }
}
