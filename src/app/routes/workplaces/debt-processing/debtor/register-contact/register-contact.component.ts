import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { AddressGridComponent } from './address/address.component';
import { PhoneGridComponent } from './phone/phone.component';

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
        component: PhoneGridComponent,
        title: 'debtor.information.phone.title'
      },
      {
        component: AddressGridComponent,
        title: 'debtor.information.address.title'
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
