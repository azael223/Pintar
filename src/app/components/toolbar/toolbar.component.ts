import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToolType } from 'src/app/models/toolType';
import { ToolsManagerService } from 'src/app/services/tools-manager.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(private _tm: ToolsManagerService) {}

  public onDestroy = new Subject<any>();

  public colorControl = new FormControl({ value: '#000000', disabled: false });
  public color2Control = new FormControl({ value: '#ffffff', disabled: false });
  public heightControl = new FormControl({ value: 1, disabled: false });

  ngOnInit(): void {
    this.setListeners();
  }

  changeToolType(type: keyof typeof ToolType) {
    this._tm.ToolType.set(type);
  }

  setListeners() {
    this.colorControl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => this._tm.Color.set(value));

    this.color2Control.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => this._tm.Color2.set(value));

    this.heightControl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe((height) => {
        this._tm.Height.set(height);
      });
  }
}
