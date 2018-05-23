import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  Input
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators/map';

import { IAction } from '@app/shared/mass-ops/mass-operation.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { LookupService } from '@app/core/lookup/lookup.service';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-dropdown',
  templateUrl: './action-dropdown.component.html',
})
export class ActionDropdownComponent implements OnInit, OnDestroy {
  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  @Input() label: string;
  @Input() lookupKey: ILookupKey;
  @Input() labelKey: string;
  @Input() actions: IMetadataAction[];
  @Input() options: IOption[] = [];

  context: any = {};

  actionData: IAction;

  private optionsSubscription: Subscription;
  private contextSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private debtorService: DebtorService
  ) { }

  ngOnInit(): void {
    if (this.lookupKey) {
      this.optionsSubscription = this.lookupService.lookupAsOptions(this.lookupKey)
        .subscribe(options => {
          this.options = options;
          this.cdRef.markForCheck();
        });
    }

    this.contextSubscription = combineLatest(
      this.debtorService.debtId$,
      this.debtorService.debtorId$
    )
    .pipe(
      map(([debtId, debtorId]) => ({ debtId, debtorId }))
    )
    .subscribe(context => {
      this.context = context;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.lookupKey) {
      this.optionsSubscription.unsubscribe();
    }
    this.contextSubscription.unsubscribe();
  }

  onOptionClick(option: IOption): void {
    this.actionData = this.getActionData(Number(option.value));
    this.dropdown.close();
  }

  onCloseAction(): void {
    this.actionData = null;
  }

  private getMetadataAction(actionId: number): IMetadataAction {
    return this.actions.find(action => action.id === actionId);
  }

  private getActionData(actionId: number): IAction {
    const metadataAction = this.getMetadataAction(actionId);
    return {
      id: metadataAction.id,
      name: metadataAction.action,
      addOptions: metadataAction.addOptions,
      params: metadataAction.params,
      payload: {
        type: metadataAction.type,
        data: metadataAction.params.reduce((acc, param) => ({ ...acc, [param]: this.context[param] }), {})
      },
      asyncMode: metadataAction.asyncMode,
      outputConfig: metadataAction.outputConfig
    };
  }
}
