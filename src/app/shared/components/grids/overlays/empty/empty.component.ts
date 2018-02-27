import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-grid-empty-overlay',
  templateUrl: './empty.component.html',
})
export class EmptyOverlayComponent implements INoRowsOverlayAngularComp {
  agInit(): void {}

  getGui(): HTMLElement {
    return null;
  }
}
