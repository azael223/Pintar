import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToolType } from '../models/toolType';

@Injectable({
  providedIn: 'root',
})
export class ToolsManagerService {
  constructor() {}

  private _color: string;
  private _height: number;
  private _toolType: keyof typeof ToolType;

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

  public ToolType = {
    get: () => this._toolType,
    onChange: new Subject<keyof typeof ToolType>(),
    set: (type: keyof typeof ToolType) => {
      this._toolType = type;
      this.ToolType.onChange.next(type);
    },
  };
}
