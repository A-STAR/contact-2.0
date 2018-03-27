import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ITitlebar } from '@app/shared/components/titlebar/titlebar.interface';
import { IMetadataEntityGridConfig, IGridEntity, IEntityGridAction, IEntityActionMetadata } from './entity-grid.interface';

import { EntityGridService } from './entity-grid.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-entity-grid',
  templateUrl: './entity-grid.component.html',
})
export class EntityGridComponent<T extends IGridEntity> implements OnInit, AfterViewInit {

  readonly actions: IEntityGridAction[] = [];

  @Input() config: IMetadataEntityGridConfig;

  columns: ISimpleGridColumn<T>[];

  titlebar: ITitlebar;

  readonly selectedRows$ = new BehaviorSubject<T[]>(null);

  private _rows: Array<T> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityGridService: EntityGridService
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.columns = this.createColumns();
    this.titlebar = this.createTitleBar();
  }

  get persistenceKey(): string {
    return this.config.persistenceKey;
  }

  get translationKey(): string {
    return `${this.config.translationKey}.${this.config.entityKey}`;
  }

  get entityKey(): string {
    return `entities.${this.config.entityKey}`;
  }

  get rows(): Array<T> {
    return this._rows;
  }

  get selectedRows(): T[] {
    return this.selectedRows$.value && this.selectedRows$.value
      .map(selectedRow => (this._rows || []).find(row => row.id === selectedRow.id));
  }

  onSelect(rows: T[]): void {
    this.selectedRows$.next(rows);
  }

  fetch(): void {
    this.entityGridService.fetchAll<T>(this.config.apiKey, this.entityKey).subscribe(rows => {
      this._rows = rows;
      this.cdRef.markForCheck();
    });
  }

  getAction(type: string): IEntityGridAction {
    return this.actions.find(action => action.type === type);
  }

  getActionMetadata(type: string): IEntityActionMetadata {
    return this.config.actions.find(a => a.type === type);
  }

  createTitleBar(): ITitlebar {
    return {
      title: `${this.translationKey}.titlebar.title`,
      items: this.config.actions
        .map(metadataItem => ({ metadataItem, action: this.getAction(metadataItem.type) }))
        .map(({ metadataItem, action }) => ({
          type: action.buttonType || metadataItem.type,
          title: action.title || undefined,
          enabled: action.enabled(metadataItem.permissions),
          action: () => action.action()
        } as any))
    };
  }

  createColumns(): ISimpleGridColumn<T>[] {
    return [
      ...this.config.columns.map(addGridLabel(`${this.translationKey}.grid`))
    ] as ISimpleGridColumn<T>[];
  }
}
