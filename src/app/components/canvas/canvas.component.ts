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
import { ToolType } from 'src/app/models/toolType';
import { DrawService } from 'src/app/services/draw.service';
import { HistorialService } from 'src/app/services/historial.service';
import { ToolsManagerService } from 'src/app/services/tools-manager.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  constructor(
    private _tm: ToolsManagerService,
    private _draw: DrawService,
    private _history: HistorialService
  ) {}

  private onDestroy = new Subject<any>();

  public color = '#000000';
  public cursor = 'pencil';
  public height = 1;
  public type: keyof typeof ToolType = 'pencil';
  public context: CanvasRenderingContext2D;

  public drawing = false;

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
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.addEventListener('mousedown', (evt) => {
      this.drawing = true;
      this._draw.draw(
        {
          color: this.color,
          height: this.height,
          type: this.type,
        },
        this.canvas,
        'mousedown',
        { x: evt.clientX, y: evt.clientY }
      );
    });
    this.canvas.nativeElement.addEventListener('mouseup', (evt) => {
      this.drawing = false;
      this.context = this._draw.draw(
        {
          color: this.color,
          height: this.height,
          type: this.type,
        },
        this.canvas,
        'mouseup',
        { x: evt.clientX, y: evt.clientY }
      );
    });
    this.canvas.nativeElement.addEventListener('mouseout', (evt) => {
      this.drawing = false;
      this._draw.draw(
        {
          color: this.color,
          height: this.height,
          type: this.type,
        },
        this.canvas,
        'mouseout',
        { x: evt.clientX, y: evt.clientY }
      );
    });
    this.canvas.nativeElement.addEventListener('mousemove', (evt) => {
      if (this.drawing) {
        this._draw.draw(
          {
            color: this.color,
            height: this.height,
            type: this.type,
          },
          this.canvas,
          'mousemove',
          { x: evt.clientX, y: evt.clientY }
        );
      }
    });
  }

  initToolListeners() {
    this._tm.Color.onChange.subscribe((color) => {
      this.color = color;
      console.log(color)
    });

    this._tm.ToolType.onChange.subscribe((type) => {
      this.cursor = type;
      this.type = type;
    });
  }
}
