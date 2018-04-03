import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';
import { zip } from 'rxjs/observable/zip';

import { DictOperation } from '../attributes.interface';
import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IUserTerm } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { AttributesService } from '../attributes.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { makeKey, addGridLabel } from '@app/core/utils';
import { ValueBag } from '@app/core/value-bag/value-bag';

const labelKey = makeKey('widgets.mass');

@Component({
  selector: 'app-mass-attr-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictionaryComponent implements OnInit, OnDestroy {

  @Input() actionData: IGridAction;
  @Input() actionName: string;
  @Output() close = new EventEmitter<ICloseAction>();

  columns: ISimpleGridColumn<IUserTerm>[] = [
    { prop: 'code' },
    { prop: 'name' },
  ].map(addGridLabel('terms.grid'));

  terms: IUserTerm[];

  title: string;

  selectedTerm: IUserTerm;

  private dictCodeNumber: number;
  private permissionsSub: Subscription;

  constructor(
    private actionGridService: ActionGridService,
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService,
    private userDictionariesService: UserDictionariesService,
  ) { }

  ngOnInit(): void {

    this.dictCodeNumber = Number(this.actionGridService.getAddOption(this.actionData, 'dictCode', 0));

    this.title = this.actionName ? labelKey(`${this.actionName}.title`) : labelKey(`changeDefaultAttr.title`);

    if (Number.isInteger(this.dictCodeNumber)) {
      this.permissionsSub = zip(
        this.userDictionariesService.getDictionary(this.dictCodeNumber),
        this.attributesService.isDictCodeOperation(this.dictCodeNumber) ? this.userPermissionsService.bag() : of(null)
      )
        .subscribe(([terms, valueBag]) => {
          if (valueBag && !valueBag.containsALL(this.attributesService.getDictCodePermName(this.dictCodeNumber))) {
            const allowedDictCodes = (valueBag as ValueBag).getStringValueAsArray(
              this.attributesService.getDictCodePermName(this.dictCodeNumber)
            );
            // filter terms with allowed dict codes
            terms = terms.filter(term => allowedDictCodes.includes(term.code));
          }
          this.terms = terms;
          this.cdRef.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    if (this.permissionsSub) {
      this.permissionsSub.unsubscribe();
    }
  }

  get canSubmit(): boolean {
    return !!this.selectedTerm;
  }

  onSelect(terms: IUserTerm[]): void {
    this.selectedTerm = terms[0];
  }

  cancel(): void {
    this.close.emit();
  }

  submit(): void {
    this.attributesService
      .change(this.actionData.payload, { [DictOperation[this.dictCodeNumber]]: this.selectedTerm.code })
      .subscribe(() => {
        // const refresh = res.massInfo && !!res.massInfo.processed;
        // this.close.emit({ refresh });
        this.close.emit({ refresh: false });
      });
  }
}
