import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToolType } from 'src/app/models/toolType';
import { Draw, DrawService } from 'src/app/services/draw.service';
import { HistorialService } from 'src/app/services/historial.service';
import { ToolsManagerService } from 'src/app/services/tools-manager.service';

export interface Axes {
  x: number;
  y: number;
}
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  constructor(
    private _tm: ToolsManagerService,
    private _draw: DrawService,
    private _history: HistorialService
  ) {}

  private onDestroy = new Subject<any>();

  public index = 0;
  public color = '#000000';
  public color2 = '#ffffff';
  public cursor = 'pencil';
  public height = 1;
  public type: keyof typeof ToolType = 'pencil';
  public ctx: CanvasRenderingContext2D;
  public drawing = false;
  public event: string;
  public axes: Axes;

  ngOnInit(): void {
    this.initToolListeners();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  initCanvas() {
    this.canvas.nativeElement.width = 1920;
    this.canvas.nativeElement.height = 1080;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.addEventListener('keydown', (evt) => {
      // this.event = 'keydown';
      // this.DrawType[this.type]();
    });
    this.canvas.nativeElement.addEventListener('mousedown', (evt) => {
      this.drawing = true;
      this.event = 'mousedown';
      this.axes = { x: evt.clientX, y: evt.clientY };
      this.draw();
    });
    this.canvas.nativeElement.addEventListener('mouseup', (evt) => {
      this.drawing = false;
      this.event = 'mouseup';
      this.axes = { x: evt.clientX, y: evt.clientY };
      this.draw();
    });
    this.canvas.nativeElement.addEventListener('mouseout', (evt) => {
      this.drawing = false;
      this.event = 'mouseout';
      this.axes = { x: evt.clientX, y: evt.clientY };
      this.draw();
    });
    this.canvas.nativeElement.addEventListener('mousemove', (evt) => {
      if (this.drawing) {
        this.event = 'mousemove';
        this.axes = { x: evt.clientX, y: evt.clientY };
        this.draw();
      }
    });
  }

  initToolListeners() {
    this._tm.Color.onChange.subscribe((color) => {
      this.color = color;
      this.ctx.strokeStyle = color;
    });

    this._tm.Color2.onChange.subscribe((color) => {
      this.color2 = color;
    });

    this._tm.ToolType.onChange.subscribe((type) => {
      this.cursor = type;
      this.type = type;
    });

    this._tm.Height.onChange.subscribe((height) => {
      this.height = height;
    });
  }

  private draw() {
    console.log(this.type);
    switch (this.type) {
      case 'pencil':
        this.drawPencil();
        break;
      case 'eraser':
        this.drawEraser();
        break;
      case 'fill':
        this.drawFill();
        break;
    }
  }

  // Pencil
  private drawPencil() {
    switch (this.event) {
      case 'mousedown':
        this.index++;
        this.ctx.beginPath();
        break;
      case 'mouseup':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'mousemove':
        let ClientRect = this.canvas.nativeElement.getBoundingClientRect();
        let m = {
          x: Math.round(this.axes.x - ClientRect.left),
          y: Math.round(this.axes.y - ClientRect.top),
        };
        // this.stroke.areaAxes.push(m);
        this.ctx.lineTo(m.x, m.y);
        this.ctx.lineWidth = this.height;
        this.ctx.stroke();

        break;
      case 'mouseout':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'click':
        break;
    }
  }
  private drawShape(drawData: Draw) {}

  private drawText(drawData: Draw) {
    console.log(drawData);
    switch (drawData.event) {
      case 'mousedown':
        this.index++;
        drawData.ctx.beginPath();
        break;
      case 'mouseup':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'keydown':
        drawData.ctx.font = '16px Arial';
        // this.stroke.areaAxes.push(m);
        drawData.ctx.strokeStyle = drawData.stroke.color;
        drawData.ctx.fillText('test', 50, 50);

        break;
      case 'mouseout':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'click':
        break;
    }
  }

  private drawLine(drawData: Draw) {}

  private drawCurve(drawData: Draw) {}

  private drawFill() {
    switch (this.event) {
      case 'mousedown':
        this.index++;
        this.ctx.beginPath();

        // this.boundaryFill(this.axes.x, this.axes.y, this.color, this.color);
        this.drawing = false;
        break;
    }
  }

  private boundaryFill(
    x: number,
    y: number,
    fillColor: string,
    boundaryColor: string
  ) {
    let pixel = this.ctx.getImageData(10, 10, 1, 1).data;
    console.log(pixel);
    let pixelColor = `#${this.rgbToHex(pixel[0], pixel[1], pixel[2])}`;
    console.log(pixelColor);
    if (pixelColor !== fillColor && pixelColor !== boundaryColor) {
      this.ctx.fillStyle = this.color
      this.ctx.fillRect(x, y, 1, 1);
      this.boundaryFill(x + 1, y, fillColor, boundaryColor);
      this.boundaryFill(x, y + 1, fillColor, boundaryColor);
      this.boundaryFill(x - 1, y, fillColor, boundaryColor);
      this.boundaryFill(x, y - 1, fillColor, boundaryColor);
      this.boundaryFill(x - 1, y - 1, fillColor, boundaryColor);
      this.boundaryFill(x - 1, y + 1, fillColor, boundaryColor);
      this.boundaryFill(x + 1, y - 1, fillColor, boundaryColor);
      this.boundaryFill(x + 1, y + 1, fillColor, boundaryColor);
    }
  }

  private rgbToHex(r: number, g: number, b: number) {
    return `${this.getHex(r)}${this.getHex(g)}${this.getHex(b)}`;
  }
  private getHex(value: number) {
    let hex = Number(value).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return hex;
  }

  private drawEraser() {
    switch (this.event) {
      case 'mousedown':
        this.index++;
        this.ctx.beginPath();
        break;
      case 'mouseup':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'mousemove':
        let ClientRect = this.canvas.nativeElement.getBoundingClientRect();
        let m = {
          x: Math.round(this.axes.x - ClientRect.left),
          y: Math.round(this.axes.y - ClientRect.top),
        };
        // this.stroke.areaAxes.push(m);
        this.ctx.lineTo(m.x, m.y);
        this.ctx.strokeStyle = this.color2;
        this.ctx.lineWidth = this.height;
        this.ctx.stroke();
        break;
      case 'mouseout':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'click':
        break;
    }
  }

  private selectStroke(drawData: Draw) {}

  private startDrawing() {}
}
