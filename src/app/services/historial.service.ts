import { Injectable } from '@angular/core';
import { Historial } from '../models/Historial.model';
import { Stroke } from '../models/Stroke.model';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  private readonly HISTORIAL_KEY = 'historial_pintar';

  constructor() {}

  getTrazo(index: number) {
    return JSON.parse(localStorage.getItem(this.HISTORIAL_KEY))[index];
  }

  addTrazo(stroke: Stroke) {
    if (this.checkHistorial()) {
      this.updateHistorial(
        JSON.parse(localStorage.getItem(this.HISTORIAL_KEY)).trazos.push(stroke)
      );
    } else {
      this.updateHistorial({ strokes: [stroke] });
    }
  }

  deleteTrazo() {
    if (this.checkHistorial) {
      let historial: Historial = JSON.parse(
        localStorage.getItem(this.HISTORIAL_KEY)
      );
      historial.strokes = historial.strokes.slice(
        historial.strokes.length - 1,
        1
      );
      this.updateHistorial(historial);
    }
  }

  private updateHistorial(historial: Historial) {
    localStorage.setItem(this.HISTORIAL_KEY, JSON.stringify(historial));
  }

  private checkHistorial() {
    try {
      const historial: Historial = JSON.parse(
        localStorage.getItem(this.HISTORIAL_KEY)
      );
      return historial && historial.strokes && historial.strokes.length > 0;
    } catch (err) {
      return false;
    }
  }
}
