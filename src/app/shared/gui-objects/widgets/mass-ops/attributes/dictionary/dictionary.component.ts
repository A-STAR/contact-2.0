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
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';
import { zip } from 'rxjs/observable/zip';

import { DictOperation } from '../attributes.interface';
import { ICloseAction, IGridAction } from '../../../../../components/action-grid/action-grid.interface';
import { IGridColumn } from '../../../../../components/grid/grid.interface';
import { IUserTerm } from '../../../../../../core/user/dictionaries/user-dictionaries.interface';

import { AttributesService } from '../attributes.service';
import { GridService } from '../../../../../components/grid/grid.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { makeKey } from '../../../../../../core/utils';
import { ValueBag } from '../../../../../../core/value-bag/value-bag';
import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';

const labelKey = makeKey('widgets.mass');

@Component({
  selector: 'app-mass-attr-dictionary',
  templateUrl: './dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictionaryComponent implements OnInit, OnDestroy {

  @Input() actionData: IGridAction;
  @Input() actionName: string;
  @Output() close = new EventEmitter<ICloseAction>();

  columns: IGridColumn[] = [
    { prop: 'code' },
    { prop: 'name' },
  ];

  terms: IUserTerm[];

  title: string;

  selectedTerm: IUserTerm;

  private dictCodeNumber: number;
  private permissionsSub: Subscription;

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService,
    private gridService: GridService,
    private userDictionariesService: UserDictionariesService,
  ) { }

  ngOnInit(): void {

    this.dictCodeNumber = Number(this.actionGridFilterService.getAddOption(this.actionData, 'dictCode', 0));

    this.title = this.actionName ? labelKey(`${this.actionName}.title`) : labelKey(`changeDefaultAttr.title`);

    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
      });

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

  onSelect(term: IUserTerm): void {
    this.selectedTerm = term;
  }

  cancel(): void {
    this.close.emit();
  }

  submit(): void {
    this.attributesService
      .change(this.actionData.payload, { [DictOperation[this.dictCodeNumber]]: this.selectedTerm.code })
      .subscribe((res) => {
        const refresh = res.massInfo && !!res.massInfo.processed;
        this.close.emit({ refresh });
      });
  }
}
