import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { AddressGridComponent } from './address/address.component';
import { MiscComponent } from './misc/misc.component';
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
    private route: ActivatedRoute,
  ) {}

  node: INode = {
    container: 'tabs',
    children: [
      {
        component: PhoneGridComponent,
        title: 'debtor.information.phone.title',
        inject: {
          entityType: 18,
          entityId: this.routeParams.personId,
        }
      },
      {
        component: AddressGridComponent,
        title: 'debtor.information.address.title',
        inject: {
          entityType: 18,
          entityId: this.routeParams.personId,
        }
      },
      {
        component: MiscComponent,
        // TODO(d.maltsev): i18n
        title: 'misc'
      },
    ]
  };

  get routeParams(): any {
    return (this.route.params as BehaviorSubject<any>).value;
  }

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
