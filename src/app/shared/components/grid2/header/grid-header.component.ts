import { Renderer2 } from '@angular/core';
import { ColDef, Column, IComponent } from 'ag-grid';
import * as R from 'ramda';

import {
  Grid2SortingEnum,
  IGrid2ColumnSettings,
  IGrid2ColumnsSettings,
  IGrid2HeaderParams,
} from '../grid2.interface';

import { FilterObject } from '../filter/grid2-filter';

export class GridHeaderComponent implements IComponent<IGrid2HeaderParams> {
  private agParams: IGrid2HeaderParams;
  private eGui: HTMLElement;
  private eFilterButton;
  private eFilterIcon;
  private eSortUpButton;
  private eSortDownButton;
  private columnsSettings: IGrid2ColumnsSettings;
  private isFrozen: boolean;
  private unlistenClickColumnListener: Function;
  private unlistenFilterClickListener: Function;

  init(agParams: IGrid2HeaderParams): void {
    this.agParams = agParams;
    this.buildHeaderColumn();
    this.bindSubElements();

    this.unlistenClickColumnListener =
      this.renderer.listen(this.eGui, 'click', this.onClickColumnListener.bind(this));

    if (this.agParams.enableMenu) {
      this.unlistenFilterClickListener =
        this.eFilterButton.addEventListener('click', this.onFilterClickListener.bind(this));
    } else {
      this.eGui.removeChild(this.eFilterButton);
    }
    this.setDefaultStyles();
    this.agParams.headerColumns.push(this);
  };

  destroy(): void {
    this.unlistenClickColumnListener();
    if (this.unlistenFilterClickListener) {
      this.unlistenFilterClickListener();
    }
    this.agParams.headerColumns = this.agParams.headerColumns
      .filter((gridHeaderComponent: GridHeaderComponent) => this !== gridHeaderComponent);

    this.renderer.removeChild(this.eGui.parentNode, this.eGui);
  }

  onClickColumnListener($event: MouseEvent): void {
    if (this.isFrozen) {
      return;
    }

    const { serviceDispatcher }  = this.agParams;

    serviceDispatcher.dispatchSortingDirection({
      columnId: this.columnId,
      multiSort: $event.shiftKey,
      sortingDirection: this.sortingDirectionBySettings === Grid2SortingEnum.ASC
        ? Grid2SortingEnum.DESC
        : Grid2SortingEnum.ASC,
      sortingOrder: this.agParams.serviceDispatcher.allGridColumns
        .findIndex((column: Column) => column.getColDef().field === this.columnId)
    });
  }

  onFilterClickListener($event: MouseEvent): void {
    if (this.isFrozen) {
      return;
    }
    this.stopEvent($event);
    this.agParams.serviceDispatcher.dispatchShowFilter({ currentFilterColumn: this.agParams.column });
  }

  get renderer(): Renderer2 {
    return this.agParams.renderer2;
  }

  get columnId(): string {
    return this.colDef.field;
  }

  get columnDisplayName(): string {
    return this.colDef.headerName;
  }

  get colDef(): ColDef {
    return this.agParams.column.getColDef();
  }

  refreshView(columnsSettings: IGrid2ColumnsSettings): void {
    this.columnsSettings = columnsSettings;
    this.setStyles();
  }

  freeze(isFrozen: boolean): void {
    this.isFrozen = isFrozen;
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  get sortingDirectionBySettings(): Grid2SortingEnum {
    const columnState: IGrid2ColumnSettings = this.columnsSettings && this.columnsSettings[this.columnId];
    return columnState ? columnState.sortingDirection : null;
  }

  get filterBySettings(): FilterObject {
    const columnState: IGrid2ColumnSettings = this.columnsSettings && this.columnsSettings[this.columnId];
    return columnState ? columnState.filter : null;
  }

  private bindSubElements(): void {
    this.eFilterButton = this.eGui.querySelector('.header-filter-item');
    this.eSortUpButton = this.eGui.querySelector('.sort-up');
    this.eSortDownButton = this.eGui.querySelector('.sort-down');
    this.eFilterIcon = this.eGui.querySelector('.fa-filter');
  }

  private buildHeaderColumn(): void {
    this.eGui = document.createElement('div');
    this.eGui.className = 'header-item-wrapper';
    this.eGui.style.height = this.eGui.style.lineHeight = this.agParams.headerHeight + 'px';
    this.eGui.innerHTML = `
        <div class="header-display-item">${this.columnDisplayName}</div>
        <div class="header-sort-item sort-up"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>
        <div class="header-sort-item sort-down"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>
        <div class="header-filter-item"><i class="fa fa-filter" aria-hidden="true"></i></div>
      `;
  }

  private stopEvent($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
  }

  private setStyles(): void {
    this.setDefaultStyles();

    if (!R.isNil(this.sortingDirectionBySettings)) {
      switch (this.sortingDirectionBySettings) {
        case Grid2SortingEnum.DESC:
          this.renderer.setStyle(this.eSortDownButton, 'display', '');
          break;
        case Grid2SortingEnum.ASC:
          this.renderer.setStyle(this.eSortUpButton, 'display', '');
          break;
      }
    }
    if (!R.isNil(this.filterBySettings)) {
      this.renderer.addClass(this.eFilterButton, 'active-filter');
    }
  }

  private setDefaultStyles(): void {
    this.renderer.setStyle(this.eSortUpButton, 'display', 'none');
    this.renderer.setStyle(this.eSortDownButton, 'display', 'none');
    this.renderer.removeClass(this.eFilterButton, 'active-filter');
  }
}
