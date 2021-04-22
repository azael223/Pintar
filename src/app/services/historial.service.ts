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

  addTrazo(trazo: Stroke) {
    if (this.checkHistorial()) {
      this.updateHistorial(
        JSON.parse(localStorage.getItem(this.HISTORIAL_KEY)).trazos.push(trazo)
      );
    } else {
      this.updateHistorial({ trazos: [trazo] });
    }
  }

  deleteTrazo() {
    if (this.checkHistorial) {
      let historial: Historial = JSON.parse(
        localStorage.getItem(this.HISTORIAL_KEY)
      );
      historial.trazos = historial.trazos.slice(historial.trazos.length - 1, 1);
      this.updateHistorial(historial);
    }
  }

  private updateHistorial(historial: Historial) {
    localStorage.setItem(this.HISTORIAL_KEY, JSON.stringify(historial));
  }

  private checkHistorial() {
    const historial: Historial = JSON.parse(
      localStorage.getItem(this.HISTORIAL_KEY)
    );
    return historial && historial.trazos && historial.trazos.length > 0;
  }
}
