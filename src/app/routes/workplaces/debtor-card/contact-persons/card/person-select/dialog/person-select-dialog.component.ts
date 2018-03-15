import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Output, ViewChild, Input
} from '@angular/core';

import { IPerson } from '../person-select.interface';

import { PersonSelectCardComponent } from '../card/person-select-card.component';

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
    return this.card && !!this.card.canSubmit;
  }

  onSave(): void {
    this.card.submitPerson().subscribe(person => this.select.emit(person));
  }

  onClose(): void {
    this.close.emit();
  }
}
