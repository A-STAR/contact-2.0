import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';

import { IProperty } from '@app/routes/workplaces/core/property/property.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { PropertySearchService } from './property-search.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';
import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-property-search',
  templateUrl: 'property-search.component.html'
})
export class PropertySearchComponent implements OnInit {

  @Input() personId: number;

  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<any>;

  readonly columns: ISimpleGridColumn<any>[] = [
    { prop: 'name' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'isConfirmed', renderer: TickRendererComponent },
    { prop: 'comment' },
  ].map(addGridLabel('routes.workplaces.shared.propertySearch.grid'));

  private _rows = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private propertySearchService: PropertySearchService,
  ) {}

  get property(): IProperty {
    return this.grid.selection[0];
  }

  get rows(): any[] {
    return this._rows;
  }

  ngOnInit(): void {
    this.propertySearchService
      .readAll(this.personId)
      .subscribe(rows => {
        this._rows = rows;
        this.cdRef.markForCheck();
      });
  }
}
