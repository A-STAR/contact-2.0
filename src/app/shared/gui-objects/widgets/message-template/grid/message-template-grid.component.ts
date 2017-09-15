import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IMessageTemplate } from '../message-template.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../components/grid/grid.service';
import { MessageTemplateService } from '../message-template.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-message-template-grid',
  templateUrl: './message-template-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplateGridComponent implements OnInit {
  @Input() typeCode: number;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => console.log('add'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => console.log('edit'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => console.log('delete'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => console.log('refresh'),
    }
  ];

  columns: IGridColumn[] = [
    { prop: 'id', maxWidth: 80 },
    { prop: 'name', maxWidth: 240 },
    { prop: 'text' },
  ];

  templates: IMessageTemplate[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private messageTemplateService: MessageTemplateService,
  ) {}

  ngOnInit(): void {
    this.initColumns();
    this.messageTemplateService.fetchAll(this.typeCode).subscribe(templates => {
      this.templates = templates;
      this.cdRef.markForCheck();
    });
  }

  private initColumns(): void {
    if (this.typeCode === 2) {
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
}
