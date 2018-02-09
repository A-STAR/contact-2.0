import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Output, ViewChild, Input
} from '@angular/core';

import { IPerson } from 'app/shared/gui-objects/widgets/person-select/person-select.interface';

import { PersonSelectCardComponent } from 'app/shared/gui-objects/widgets/person-select/card/person-select-card.component';

@Component({
  selector: 'app-person-select-dialog',
  templateUrl: './person-select-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonSelectDialogComponent {

  @ViewChild(PersonSelectCardComponent) card: PersonSelectCardComponent;

  @Input() personId: number;

  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IPerson>();

  get canSave(): boolean {
    return this.card && !!this.card.isValid;
  }

  onSave(): void {
    this.card.submitPerson().subscribe(person => this.select.emit(person));
  }

  onClose(): void {
    this.close.emit();
  }
}
