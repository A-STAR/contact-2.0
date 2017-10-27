import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { AddressGridComponent } from '../../../../../shared/gui-objects/widgets/address/grid/address-grid.component';
import { PhoneGridComponent } from '../../../../../shared/gui-objects/widgets/phone/grid/phone-grid.component';

@Component({
  selector: 'app-register-contact-dialog',
  templateUrl: './register-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterContactComponent {
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  node: INode = {
    container: 'tabs',
    children: [
      {
        component: AddressGridComponent,
        title: 'debtor.information.address.title',
        inject: { personRole: 1, displayToolbar: false }
      },
      {
        component: PhoneGridComponent,
        title: 'debtor.information.phone.title',
        inject: { personRole: 1, contactType: 1, displayToolbar: false }
      },
    ]
  };

  get canSubmit(): boolean {
    return false;
  }

  onSubmit(): void {
    this.submit.emit({});
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
