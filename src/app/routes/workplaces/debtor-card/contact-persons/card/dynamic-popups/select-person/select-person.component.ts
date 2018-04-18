import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { ContactPersonCardService } from '../../contact-person-card.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';
import { SelectPersonService } from './select-person.service';

import { SelectPersonGridComponent } from './grid/select-person-grid.component';

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
  @ViewChild(SelectPersonGridComponent) grid: SelectPersonGridComponent;

  constructor(
    private contactPersonCardService: ContactPersonCardService,
    private popupOutletService: PopupOutletService,
  ) {}

  onClose(): void {
    this.popupOutletService.close();
  }

  onSubmit(): void {
    this.contactPersonCardService.selectContactPerson(this.grid.selection[0]);
    this.popupOutletService.close();
  }
}
