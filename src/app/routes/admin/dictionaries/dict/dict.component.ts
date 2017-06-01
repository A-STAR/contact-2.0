import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { IDict } from './dict.interface';
import { IDataSource, IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { IEntityTranslation } from '../../../../core/entity/translations/entity-translations.interface';

import { DictService } from './dict.service';
import { EntityTranslationsService } from '../../../../core/entity/translations/entity-translations.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html'
})
export class DictComponent extends GridEntityComponent<IDict> {

  private dictReady = false;

  toolbarActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'DICT_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_DELETE' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  toolbarActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<IGridColumn> = [
    { prop: 'code', minWidth: 100, maxWidth: 150 },
    { prop: 'name', maxWidth: 300 },
    { prop: 'parentCode', width: 200 },
    { prop: 'typeCode', localized: true },
  ];

  renderers: IRenderer = {
    parentCode: [],
    typeCode: [
      { label: 'dictionaries.types.system', value: 1 },
      { label: 'dictionaries.types.client', value: 2 }
    ]
  };

  dataSource: IDataSource = {
    read: '/api/dictionaries',
    dataKey: 'dictNames',
  };

  constructor(
    private dictService: DictService,
    private gridService: GridService,
    private valueConverterService: ValueConverterService,
    private entityTranslationsService: EntityTranslationsService,
    private route: ActivatedRoute,
  ) {
    super();

    this.renderers.parentCode = this.route.snapshot.data.dictionaries.dictNames
      .map(dict => ({ label: dict.name, value: dict.code }));
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  onEdit(): void {
    super.onEdit();
    this.dictReady = false;

    this.entityTranslationsService.readDictNameTranslations(this.selectedEntity.id)
      .subscribe((translations: IEntityTranslation[]) => this.onLoadNameTranslations(translations));
  }

  onLoadNameTranslations(currentTranslations: IEntityTranslation[]): void {
    this.dictReady = true;

    this.selectedEntity.nameTranslations = currentTranslations
      .map((entityTranslation: IEntityTranslation) => {
        return {
          value: entityTranslation.languageId,
          context: { translation: entityTranslation.value }
        };
      });
  }

  modifyEntity(data: IDict, editMode: boolean): void {
    data.typeCode = this.valueConverterService.firstLabeledValue(data.typeCode);
    data.parentCode = this.valueConverterService.firstLabeledValue(data.parentCode);
    data.termTypeCode = this.valueConverterService.firstLabeledValue(data.termTypeCode);

    if (editMode) {
      const editTasks = [
        this.gridService.update(`/api/dictionaries/{code}`, this.selectedEntity, data)
      ];
      const nameTranslations: Array<ILabeledValue> = data.nameTranslations || [];
      if (nameTranslations.length) {
        nameTranslations
          .filter((item: ILabeledValue) => item.removed)
          .forEach((item: ILabeledValue) => {
            editTasks.push(
              this.entityTranslationsService.deleteDictNameTranslation(this.selectedEntity.id, item.value)
            );
          });

        const updatedTranslations: IEntityTranslation[] = nameTranslations
          .filter((item: ILabeledValue) => !item.removed)
          .map<IEntityTranslation>((item: ILabeledValue) => {
            return { languageId: item.value, value: item.context ? item.context.translation : null };
          })
          .filter((item: IEntityTranslation) => item.value !== null);

        if (updatedTranslations.length) {
          editTasks.push(
            this.entityTranslationsService.saveDictNameTranslations(this.selectedEntity.id, updatedTranslations)
          );
        }
      }
      delete data.translatedName;
      delete data.nameTranslations;

      Observable.forkJoin(editTasks).subscribe(() => this.onSuccess());
    } else {
      this.gridService.create('/api/dictionaries', {}, data).subscribe(() => this.onSuccess());
    }
  }

  onUpdateEntity(data: IDict): void {
    this.modifyEntity(data, true);
  }

  onCreateEntity(data: IDict): void {
    this.modifyEntity(data, false);
  }

  onRemoveSubmit(): void {
    this.dictService.removeDict(this.selectedEntity).subscribe(() => this.onSuccess());
  }

  onSuccess(): void {
    this.cancelAction();
    this.afterUpdate();
  }

  get isReadyForEditing(): boolean {
    // TODO replace dictReady with router resolve
    return this.selectedEntity && this.dictReady;
  }
}
