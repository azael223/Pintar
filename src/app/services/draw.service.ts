import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Historial } from '../models/Historial.model';
import { Stroke } from '../models/Stroke.model';
import { HistorialService } from './historial.service';

enum events {
  'click',
  'mousedown',
  'mouseup',
  'mouseout',
  'mousemove',
  'keydown',
}

export interface Draw {
  stroke: Stroke;
  canvas: ElementRef<HTMLCanvasElement>;
  event: keyof typeof events;
  axes: { x: number; y: number };
  ctx?: CanvasRenderingContext2D;
}

@Injectable({
  providedIn: 'root',
})
export class DrawService {
  constructor(private _historial: HistorialService) {}

  private index = 0;

  public onDraw = new Subject<Draw>();

  private drawed(draw: Draw) {
    this.onDraw.next(draw);
  }

  draw(
    stroke: Stroke,
    canvas: ElementRef<HTMLCanvasElement>,
    event: keyof typeof events,
    axes: { x: number; y: number }
  ) {
    try {
      let data: Draw = {
        stroke,
        canvas,
        event,
        axes,
        ctx: canvas.nativeElement.getContext('2d'),
      };
      if (stroke && canvas && event && axes) {
        this.DrawType[stroke.type](data);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  }

  private DrawType = {
    pencil: this.drawPencil,
    // shape: this.drawShape,
    text: this.drawText,
    // line: this.drawLine,
    // curve: this.drawCurve,
    // fill: this.drawFill,
    eraser: this.drawEraser,
    // select: this.selectStroke,
  };

  // Pencil
  private drawPencil(drawData: Draw) {
    switch (drawData.event) {
      case 'mousedown':
        this.index++;
        drawData.ctx.beginPath();
        this.drawed(drawData);

        break;
      case 'mouseup':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'mousemove':
        let ClientRect = drawData.canvas.nativeElement.getBoundingClientRect();
        let m = {
          x: Math.round(drawData.axes.x - ClientRect.left),
          y: Math.round(drawData.axes.y - ClientRect.top),
        };
        // this.stroke.areaAxes.push(m);
        drawData.ctx.lineTo(m.x, m.y);
        drawData.ctx.strokeStyle = drawData.stroke.color;
        drawData.ctx.lineWidth = drawData.stroke.height;
        drawData.ctx.stroke();
        this.drawed(drawData);

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
        this.drawed(drawData);

        break;
      case 'mouseup':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'keydown':
        drawData.ctx.font = '16px Arial';
        // this.stroke.areaAxes.push(m);
        drawData.ctx.strokeStyle = drawData.stroke.color;
        drawData.ctx.fillText(
          "test",
          50,
          50
        );
        this.drawed(drawData);

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

  private drawFill(drawData: Draw) {}

  private drawEraser(drawData: Draw) {
    switch (drawData.event) {
      case 'mousedown':
        this.index++;
        drawData.ctx.beginPath();
        this.drawed(drawData);

        break;
      case 'mouseup':
        // this._historial.addTrazo(drawData.stroke);
        break;
      case 'mousemove':
        let ClientRect = drawData.canvas.nativeElement.getBoundingClientRect();
        let m = {
          x: Math.round(drawData.axes.x - ClientRect.left),
          y: Math.round(drawData.axes.y - ClientRect.top),
        };
        // this.stroke.areaAxes.push(m);
        drawData.ctx.lineTo(m.x, m.y);
        drawData.ctx.strokeStyle = '#ffffff';
        drawData.ctx.lineWidth = drawData.stroke.height;
        drawData.ctx.stroke();
        this.drawed(drawData);

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
