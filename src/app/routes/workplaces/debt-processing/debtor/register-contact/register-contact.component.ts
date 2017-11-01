import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RegisterContactService } from './register-contact.service';

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

  @ViewChild(AddressGridComponent) addressTab: AddressGridComponent;
  @ViewChild(MiscComponent) miscTab: MiscComponent;
  @ViewChild(PhoneGridComponent) phoneTab: PhoneGridComponent;

  private selectedTabIndex: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private registerContactService: RegisterContactService,
    private route: ActivatedRoute,
  ) {}

  get entityType(): number {
    return 18;
  }

  get entityId(): number {
    return this.routeParams.personId;
  }

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get routeParams(): any {
    return (this.route.params as BehaviorSubject<any>).value;
  }

  get canRegisterPhones$(): Observable<boolean> {
    return this.registerContactService.canRegisterPhones$;
  }

  get canRegisterAddresses$(): Observable<boolean> {
    return this.registerContactService.canRegisterAddresses$;
  }

  get canRegisterMisc$(): Observable<boolean> {
    return this.registerContactService.canRegisterMisc$;
  }

  onTabSelect(index: any): void {
    this.selectedTabIndex = index;
    this.cdRef.markForCheck();
  }

  onAddressAction(contactId: number): void {
    this.submit.emit({ contactType: 3, contactId });
  }

  onPhoneAction(contactId: any): void {
    this.submit.emit({ contactType: 2, contactId });
  }

  // onSubmit(): void {
  //   this.submit.emit(this.submitPayload);
  // }

  onCancel(): void {
    this.cancel.emit();
  }

  // private get submitPayload(): any {
  //   switch (this.selectedTabIndex) {
  //     case 0:
  //       return {
  //         contactType: 3,
  //         contactId: this.addressTab.selectedAddressId
  //       };
  //     case 1:
  //       return {
  //         contactType: 3,
  //         contactId: this.phoneTab.selectedPhoneId
  //       };
  //     default:
  //       return null;
  //   }
  // }
}
