import { ElementRef, Injectable } from '@angular/core';
import { Historial } from '../models/Historial.model';
import { Stroke } from '../models/Stroke.model';
import { HistorialService } from './historial.service';

enum events {
  'click',
  'mousedown',
  'mouseup',
  'mouseout',
  'mousemove',
}

interface Draw {
  stroke: Stroke;
  canvas: ElementRef<HTMLCanvasElement>;
  event: keyof typeof events;
  axes: { x: number; y: number };
}

@Injectable({
  providedIn: 'root',
})
export class DrawService {
  constructor(private _historial: HistorialService) {}

  private stroke: Stroke;
  private index = 0;
  draw(
    stroke: Stroke,
    canvas: ElementRef<HTMLCanvasElement>,
    event: keyof typeof events,
    axes: { x: number; y: number }
  ): CanvasRenderingContext2D {
    try {
      let data: Draw = { stroke, canvas, event, axes };
      console.log(data)
      if (data) {
        return this.DrawType[stroke.type](data);
      } else {
        return canvas.nativeElement.getContext('2d');
      }
    } catch (err) {
      console.log(err);
      return canvas.nativeElement.getContext('2d');
    }
  }

  private DrawType = {
    pencil: this.drawPencil,
    // shape: this.drawShape,
    // text: this.drawText,
    // line: this.drawLine,
    // curve: this.drawCurve,
    // fill: this.drawFill,
    // eraser: this.drawEraser,
    // select: this.selectStroke,
  };

  // Pencil
  private drawPencil(drawData: Draw) {
    let ctx = drawData.canvas.nativeElement.getContext('2d');
    console.log(this.stroke)
    switch (drawData.event) {
      case 'mousedown':
        this.index++;
        this.stroke = drawData.stroke;
        this.stroke.positionAxes = drawData.axes;
        this.stroke.zIndex = this.index;
        ctx.beginPath();
        break
      case 'mouseup':
        // this._historial.addTrazo(drawData.stroke);
        break
      case 'mousemove':
        let ClientRect = drawData.canvas.nativeElement.getBoundingClientRect();
        let m = {
          x: Math.round(drawData.axes.x - ClientRect.left),
          y: Math.round(drawData.axes.y - ClientRect.top),
        };
        // this.stroke.areaAxes.push(m);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = drawData.stroke.color;
        ctx.stroke();
        break;
      case 'mouseout':
        this._historial.addTrazo(drawData.stroke);
        break;
      case 'click':
        break;
    }
    return ctx;
  }
  private drawShape(drawData: Draw) {}

  private drawText(drawData: Draw) {}

  private drawLine(drawData: Draw) {}

  private drawCurve(drawData: Draw) {}

  private drawFill(drawData: Draw) {}

  private drawEraser(drawData: Draw) {}

  private selectStroke(drawData: Draw) {}
}
