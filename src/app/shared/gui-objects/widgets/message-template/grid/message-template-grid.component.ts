import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IMessageTemplate } from '../message-template.interface';

import { GridService } from '../../../../../shared/components/grid/grid.service';
import { MessageTemplateService } from '../message-template.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-message-template-grid',
  templateUrl: './message-template-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplateGridComponent implements OnInit {
  @Input() typeCode: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private messageTemplateService: MessageTemplateService,
  ) {}

  columns: IGridColumn[] = [
    { prop: 'id', maxWidth: 80 },
    { prop: 'name', maxWidth: 240 },
    { prop: 'text' },
  ];
  templates: IMessageTemplate[];

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
