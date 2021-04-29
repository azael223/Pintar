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
  public currentIndex = -1;
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
  public prevAxes: Axes;
  public dimensions = { width: 1920, height: 1080 };
  public width = 10;
  public pixelColor = '#000000';
  public data: ImageData[] = [];

  public prevData: {
    axes: { x: number; y: number };
    imageData: ImageData;
  }[] = [];

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
    this.canvas.nativeElement.width = this.dimensions.width;
    this.canvas.nativeElement.height = this.dimensions.height;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
    this.dataHandler();

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
    this.canvas.nativeElement.addEventListener('mousemove', (evt) => {
      if (this.drawing) {
        this.event = 'mousemove';
        this.axes = { x: evt.clientX, y: evt.clientY };
        this.draw();
      }
    });
    // this.canvas.nativeElement.addEventListener('click', (evt) => {
    //   this.drawing = true;
    //   this.event = 'click';
    //   this.axes = { x: evt.clientX, y: evt.clientY };
    //   this.draw();
    // });
  }

  initToolListeners() {
    this._tm.Color.onChange.subscribe((color) => {
      this.color = color;
      this.ctx.strokeStyle = color;
      this.ctx.fillStyle = color;
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

    this._tm.Width.onChange.subscribe((width) => {
      this.width = width;
    });

    this._tm.Undo.onChange.subscribe((value) => {
      this.undo();
    });

    this._tm.Redo.onChange.subscribe((value) => {
      this.dataHandler(true);
    });
  }

  private draw() {
    let ClientRect = this.canvas.nativeElement.getBoundingClientRect();
    this.axes = {
      x: Math.round(this.axes.x - ClientRect.left),
      y: Math.round(this.axes.y - ClientRect.top),
    };
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
      case 'line':
        this.drawLine();
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
        this.dataHandler();
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'mousemove':
        // this.stroke.areaAxes.push(m);
        this.ctx.lineTo(this.axes.x, this.axes.y);
        this.ctx.lineWidth = this.height;
        this.ctx.stroke();

        break;
      case 'click':
        break;
    }
  }
  private drawShape(drawData: Draw) {}

  private drawText(drawData: Draw) {
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

  private drawLine() {
    switch (this.event) {
      case 'mousedown':
        this.index++;
        this.prevAxes = this.axes;
        break;
      case 'mousemove':
        this.resetPixels();
        this.dda();
        break;
      case 'mouseup':
        this.dda();
        break;
    }
  }

  private dda() {
    this.ctx.fillStyle = this.color;
    let dx = this.axes.x - this.prevAxes.x;
    let dy = this.axes.y - this.prevAxes.y;
    let steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
    let axesInc = { x: dx / steps, y: dy / steps };
    let axes = { x: this.prevAxes.x, y: this.prevAxes.y };
    for (let index = 0; index <= steps; index++) {
      this.prevData.push({
        axes: { x: Math.round(axes.x), y: Math.round(axes.y) },
        imageData: this.getPixelsColor(
          Math.round(axes.x),
          Math.round(axes.y),
          this.height
        ),
      });
      this.ctx.fillRect(
        Math.round(axes.x),
        Math.round(axes.y),
        this.height,
        this.height
      );
      axes.x += axesInc.x;
      axes.y += axesInc.y;
    }
  }

  private resetPixels() {
    this.prevData.forEach((data) => {
      this.ctx.putImageData(data.imageData, data.axes.x, data.axes.y);
    });
    this.prevData = [];
  }

  private getPixelsColor(x: number, y: number, heigth: number) {
    return this.ctx.getImageData(x, y, heigth, heigth);
  }

  private drawCurve(drawData: Draw) {}

  private drawFill() {
    switch (this.event) {
      case 'mousedown':
        this.index++;
        let pixelColor = this.getPixelColor(this.axes.x, this.axes.y, 1)[0];
        this.ctx.fillStyle = this.color;
        this.boundaryFill(this.axes.x, this.axes.y, pixelColor, this.color);
        this.drawing = false;
        break;
    }
  }

  private floodFill(x: number, y: number, prevColor: string, newColor: string) {
    const imgData = this.ctx.getImageData(
      0,
      0,
      this.dimensions.width,
      this.dimensions.height
    );
    const p32 = new Uint32Array(imgData.data.buffer);
  }

  private boundaryFill(
    x: number,
    y: number,
    prevColor: string,
    newColor: string
  ) {
    if (
      !(
        x >= 0 &&
        y >= 0 &&
        y <= this.dimensions.height &&
        x <= this.dimensions.width
      )
    ) {
      return;
    }
    let pixelColor = this.getPixelColor(x, y, 1)[0];
    if (pixelColor == prevColor) {
      this.ctx.fillRect(x, y, 1, 1);
      this.boundaryFill(x + 1, y, prevColor, newColor);
      this.boundaryFill(x - 1, y, prevColor, newColor);
      this.boundaryFill(x, y - 1, prevColor, newColor);
      this.boundaryFill(x, y + 1, prevColor, newColor);
      this.boundaryFill(x - 1, y - 1, prevColor, newColor);
      this.boundaryFill(x - 1, y + 1, prevColor, newColor);
      this.boundaryFill(x + 1, y - 1, prevColor, newColor);
      this.boundaryFill(x + 1, y + 1, prevColor, newColor);
    }
  }

  private getPixelColor(x: number, y: number, heigth: number) {
    let pixels = this.ctx.getImageData(x, y, heigth, heigth).data;
    let finalData = [];
    for (let index = 0; index < pixels.length; index += 4) {
      finalData.push(
        `#${this.rgbToHex(pixels[index], pixels[index + 1], pixels[index + 2])}`
      );
    }

    return finalData;
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
        break;
      case 'mouseup':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'click':
        this.drawing = false;
        // this.stroke.areaAxes.push(m);
        this.ctx.fillStyle = this.color2;
        this.ctx.fillRect(
          this.axes.x - this.width / 2,
          this.axes.y - this.width / 2,
          this.width,
          this.width
        );
        break;
      case 'mousemove':
        this.ctx.fillStyle = this.color2;
        this.ctx.fillRect(
          this.axes.x - this.width / 2,
          this.axes.y - this.width / 2,
          this.width,
          this.width
        );
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

  private dataHandler(redo?: boolean) {
    if (redo) {
      if(this.currentIndex < this.data.length-1){
        this.ctx.putImageData(this.data[++this.currentIndex], 0, 0);
      }
    } else {
      if (this.currentIndex < this.data.length-1) {
        this.data.splice(
          this.currentIndex + 1,
          this.data.length - 1 - this.currentIndex
        );
      }
      this.currentIndex++;
      this.data.push(
        this.ctx.getImageData(
          0,
          0,
          this.dimensions.width,
          this.dimensions.height
        )
      );
      console.log(this.currentIndex);
    }
  }
  private undo() {
    if (this.currentIndex >= 0) {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.ctx.putImageData(this.data[this.currentIndex], 0, 0);
    }
  }
}
