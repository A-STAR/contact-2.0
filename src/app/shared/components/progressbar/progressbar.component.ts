import { Component, Input } from '@angular/core';

import { IProgressbarType } from './progressbar.interface';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html'
})
export class ProgressbarComponent {
  @Input() value: number;
  @Input() type: IProgressbarType = 'info';

  get cssClass(): string {
    return `progress-bar progress-bar-${this.type} progress-bar-striped`;
  }
}
