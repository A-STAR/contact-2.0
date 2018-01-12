import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-operator-details',
  templateUrl: './operator-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDialogComponent {

  @Input() userId: number;

  @Output() close = new EventEmitter<null>();

  onClose(): void {
    this.close.emit();
  }
}
