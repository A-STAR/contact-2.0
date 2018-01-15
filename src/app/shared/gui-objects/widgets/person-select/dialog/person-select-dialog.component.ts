import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Output, ViewChild
} from '@angular/core';

import { ISelectedPerson } from 'app/shared/gui-objects/widgets/person-select/person-select.interface';

import { PersonSelectCardComponent } from 'app/shared/gui-objects/widgets/person-select/card/person-select-card.component';

@Component({
  selector: 'app-person-select-dialog',
  templateUrl: './person-select-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonSelectDialogComponent {

  @ViewChild(PersonSelectCardComponent) card: PersonSelectCardComponent;

  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<ISelectedPerson>();

  get canSelect(): boolean {
    return !!this.card.isValid;
  }

  onSelect(): void {
    this.card.submitPerson().subscribe(person => this.select.emit(person));
  }

  onClose(): void {
    this.close.emit();
  }
}
