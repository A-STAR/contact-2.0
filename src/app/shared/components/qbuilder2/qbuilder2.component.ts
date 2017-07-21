import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IQuery } from './qbuilder2.interface';

@Component({
  selector: 'app-qbuilder-2',
  templateUrl: './qbuilder2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QBuilder2Component {
  @Input() query: IQuery;
}
