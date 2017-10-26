import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-address-grid-mark',
  templateUrl: './mark.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridMarkComponent {
  @Input() addressId: number;
  @Input() personId: number;

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
