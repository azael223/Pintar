import { Component, OnInit } from '@angular/core';
import { ToolsManagerService } from 'src/app/services/tools-manager.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  constructor(private _tm: ToolsManagerService) {}

  public color = "#ffffff"

  ngOnInit(): void {
    this._tm.Color.onChange.subscribe((color) => {
      this.color = color
    });
  }
}
