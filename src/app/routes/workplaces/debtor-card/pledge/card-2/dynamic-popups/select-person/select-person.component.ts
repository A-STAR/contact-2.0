import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SelectPersonService } from './select-person.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SelectPersonService,
  ],
  selector: 'app-pledge-card-select-person',
  styleUrls: [ 'select-person.component.scss' ],
  templateUrl: 'select-person.component.html'
})
export class SelectPersonComponent {
  onClose(): void {
    //
  }

  onSubmit(): void {
    //
  }
}
