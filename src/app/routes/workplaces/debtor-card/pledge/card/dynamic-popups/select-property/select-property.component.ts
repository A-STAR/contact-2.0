import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { PledgeCardService } from '../../pledge-card.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';
import { SelectPropertyService } from './select-property.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';
import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-property',
  templateUrl: 'select-property.component.html'
})
export class SelectPropertyComponent implements OnInit {
  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<any>;

  readonly columns: ISimpleGridColumn<any>[] = [
    { label: 'Название', prop: 'name' },
    { label: 'Тип имущества', prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { label: 'Подтверждено', prop: 'isConfirmed', renderer: TickRendererComponent },
    { label: 'Комментарий', prop: 'comment' },
  ];

  private _rows = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgeCardService: PledgeCardService,
    private popupOutletService: PopupOutletService,
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

  onClose(): void {
    this.popupOutletService.close();
  }

  onSubmit(): void {
    this.pledgeCardService.selectProperty(this.grid.selection[0]);
    this.popupOutletService.close();
  }
}
