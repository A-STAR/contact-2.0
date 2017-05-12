import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../../core/auth/auth.service';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from './roles.interface';

export abstract class AbstractRolesPopup implements OnChanges {
  @Input() role: IRoleRecord;
  @Output() roleChange: EventEmitter<IRoleRecord> = new EventEmitter();
  @Output() onUpdate: EventEmitter<null> = new EventEmitter();

  form: FormGroup;

  abstract controls: Array<IDynamicFormControl>;

  protected authService: AuthService;

  ngOnChanges(changes: SimpleChanges) {
    this.form = this.createForm(changes.role.currentValue);
  }

  onDisplayChange(event): void {
    if (event === false) {
      this.close();
    }
  }

  onActionClick(): void {
    this.getBaseUrl()
      .subscribe(
        baseUrl => {
        this.httpAction(baseUrl)
          .toPromise()
          .then(data => {
            if (data.ok) {
              // TODO: check success === true in data.json()
              this.onUpdate.emit();
              this.close();
            }
          });
        },
        // TODO: display & log a message
        error => console.log(error)
      );
  }

  onCancelClick(): void {
    this.close();
  }

  protected abstract createForm(role: IRoleRecord): FormGroup;

  protected abstract httpAction(baseUrl: string);

  protected getBaseUrl(): Observable<string> {
    return this.authService.getRootUrl();
  }

  private close(): void {
    this.role = null;
    this.roleChange.emit(null);
  }
}
