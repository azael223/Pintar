import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolsManagerService {
  constructor() {}

  private _color: string;
  private _height: number;

  public Color = {
    get: () => this._color,
    onChange: new Subject<string>(),
    set: (color: string) => {
      this._color = color;
      this.Color.onChange.next(color);
    },
  };

  public Height = {
    get: () => this._height,
    onChange: new Subject<number>(),
    set: (height: number) => {
      this._height = height;
      this.Height.onChange.next(height);
    },
  };
}
