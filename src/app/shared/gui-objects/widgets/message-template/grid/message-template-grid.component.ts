import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IMessageTemplate } from '../message-template.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../components/grid/grid.service';
import { MessageTemplateService } from '../message-template.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../../core/dialog';

import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-message-template-grid',
  templateUrl: './message-template-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplateGridComponent extends DialogFunctions implements OnInit {
  @Input() typeCode: number;

  selectedTemplateId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: this.userPermissionsService.has('TEMPLATE_ADD'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('TEMPLATE_EDIT'),
        this.selectedTemplateId$.map(Boolean)
      ]),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.onDelete(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('TEMPLATE_DELETE'),
        this.selectedTemplateId$.map(Boolean)
      ]),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
    }
  ];

  columns: IGridColumn[] = [
    { prop: 'id', maxWidth: 80 },
    { prop: 'name', maxWidth: 240 },
    { prop: 'text' },
  ];

  templates: IMessageTemplate[];

  dialog: 'add' | 'edit' | 'delete';

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private messageTemplateService: MessageTemplateService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get selectedTemplate$(): Observable<IMessageTemplate> {
    return this.selectedTemplateId$.map(id => (this.templates || []).find(template => template.id === id));
  }

  ngOnInit(): void {
    this.initColumns();
    this.fetch();
  }

  onSelect(template: IMessageTemplate): void {
    this.selectedTemplateId$.next(template.id);
  }

  onDblClick(template: IMessageTemplate): void {
    this.selectedTemplateId$.next(template.id);
    this.onEdit();
  }

  onAdd(): void {
    this.dialog = 'add';
    this.cdRef.markForCheck();
  }

  onEdit(): void {
    this.dialog = 'edit';
    this.cdRef.markForCheck();
  }

  onDelete(): void {
    this.dialog = 'delete';
    this.cdRef.markForCheck();
  }

  onAddDialogSubmit(template: IMessageTemplate): void {
    this.messageTemplateService.create(template).subscribe(() => this.onSubmitSuccess());
  }

  onEditDialogSubmit(template: IMessageTemplate): void {
    this.messageTemplateService.update(this.selectedTemplateId$.value, template).subscribe(() => this.onSubmitSuccess());
  }

  onDeleteDialogSubmit(): void {
    this.messageTemplateService.delete(this.selectedTemplateId$.value).subscribe(() => this.onSubmitSuccess());
  }

  private initColumns(): void {
    if (this.typeCode === MessageTemplateService.TYPE_SMS) {
      this.columns = [
        ...this.columns,
        { prop: 'isSingleSending', maxWidth: 150, renderer: 'checkboxRenderer' },
        { prop: 'recipientTypeCode', maxWidth: 100, dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
      ];

      this.gridService.setDictionaryRenderers(this.columns)
        .map(columns => this.columns = this.gridService.setRenderers(columns))
        .take(1)
        .subscribe();
    }
  }

  private onSubmitSuccess(): void {
    this.onCloseDialog();
    this.fetch();
  }

  private fetch(): void {
    this.messageTemplateService.fetchAll(this.typeCode).subscribe(templates => {
      this.templates = templates;
      this.selectedTemplateId$.next(null);
      this.cdRef.markForCheck();
    });
  }
}
