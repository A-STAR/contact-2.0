import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { IVisit } from '../../visit-prepare.interface';

import { VisitCardComponent } from '../../card/visit-card.component';

@Component({
  selector: 'app-visit-dialog',
  templateUrl: './visit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitDialogComponent {

  @ViewChild(VisitCardComponent) visitCard: VisitCardComponent;

  @Output() close = new EventEmitter<null>();
  @Output() create = new EventEmitter<IVisit>();

  get canCreate(): boolean {
    return this.visitCard && this.visitCard.canSubmit;
  }

  onCreate(): void {
    this.create.emit(this.visitCard.form.serializedUpdates);
  }

  onClose(): void {
    this.close.emit();
  }
}
