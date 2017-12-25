import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { DictOperation } from '../attributes.interface';
import { IGridColumn } from '../../../../../components/grid/grid.interface';
import { IUserTerm } from '../../../../../../core/user/dictionaries/user-dictionaries.interface';

import { AttributesService } from '../attributes.service';
import { GridService } from '../../../../../components/grid/grid.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { isInteger } from '../../../../../../core/utils';

@Component({
  selector: 'app-mass-attr-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictionaryComponent implements OnInit {

  @Input() dictCode: [number];
  @Input() debts: number[];
  @Output() close = new EventEmitter<void>();

  columns: IGridColumn[] = [
    { prop: 'code' },
    { prop: 'name' },
  ];

  terms: IUserTerm[];

  selectedTerm: IUserTerm;

  private dictCodeNumber: number;

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private userDictionariesService: UserDictionariesService,
  ) { }

  ngOnInit(): void {

    this.dictCodeNumber = this.dictCode && this.dictCode[0];

    this.gridService.setAllRenderers(this.columns)
      .subscribe(columns => {
        this.columns = [...columns];
      });

    if (isInteger(this.dictCodeNumber)) {
      this.userDictionariesService.getDictionary(this.dictCodeNumber)
        .subscribe(terms => {
          this.terms = terms;
          this.cdRef.markForCheck();
        });
    }
  }

  get canSubmit(): boolean {
    return !!this.selectedTerm;
  }

  onSelect(term: IUserTerm): void {
    this.selectedTerm = term;
  }

  submit(): void {
    this.attributesService
      .change(this.debts, { [DictOperation[this.dictCodeNumber]]: this.selectedTerm.code })
      .subscribe(() => this.close.emit());
  }

}
