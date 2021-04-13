import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor() {}

  public onDestroy = new Subject<any>();

  public colorControl = new FormControl();

  ngOnInit(): void {
    this.setListeners();
  }

  setListeners() {
    this.colorControl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => console.log(value));
  }
}
