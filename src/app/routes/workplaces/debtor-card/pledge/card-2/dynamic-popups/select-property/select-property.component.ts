import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { SelectPropertyService } from './select-property.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-property',
  templateUrl: 'select-property.component.html'
})
export class SelectPropertyComponent implements OnInit {
  readonly columns: ISimpleGridColumn<any>[] = [
    { label: 'Название', prop: 'name' },
    { label: 'Тип имущества', prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { label: 'Подтверждено', prop: 'isConfirmed', renderer: TickRendererComponent },
    { label: 'Комментарий', prop: 'comment' },
  ];

  private _rows = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private selectPropertyService: SelectPropertyService,
  ) {}

  get rows(): any[] {
    return this._rows;
  }

  ngOnInit(): void {
    this.selectPropertyService
      // TODO(d.maltsev): pass person id
      .readAll(4)
      .subscribe(rows => {
        this._rows = rows;
        this.cdRef.markForCheck();
      });
  }
}
