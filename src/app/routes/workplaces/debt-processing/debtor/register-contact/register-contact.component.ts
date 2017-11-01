import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RegisterContactService } from './register-contact.service';

import { AddressGridComponent } from './address/address.component';
import { MiscComponent } from './misc/misc.component';
import { PhoneGridComponent } from './phone/phone.component';

import { invert } from '../../../../../core/utils';

@Component({
  selector: 'app-register-contact-dialog',
  templateUrl: './register-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterContactComponent {
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private registerContactService: RegisterContactService,
    private route: ActivatedRoute,
  ) {}

  get entityType(): number {
    return 18;
  }

  get entityId(): number {
    return this.routeParams.personId;
  }

  get routeParams(): any {
    return (this.route.params as BehaviorSubject<any>).value;
  }

  get isPhonesTabDisabled$(): Observable<boolean> {
    return this.registerContactService.canRegisterPhones$.map(invert);
  }

  get isAddressesTabDisabled$(): Observable<boolean> {
    return this.registerContactService.canRegisterAddresses$.map(invert);
  }

  get isMiscTabDisabled$(): Observable<boolean> {
    return this.registerContactService.canRegisterMisc$.map(invert);
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
