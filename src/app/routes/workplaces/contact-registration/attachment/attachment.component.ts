import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../core/dialog';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.attachment');

@Component({
  selector: 'app-contact-registration-attachment',
  templateUrl: './attachment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentComponent extends DialogFunctions {
  private selectedDocumentId$ = new BehaviorSubject<number>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.setDialog('add')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: this.selectedDocumentId$.map(Boolean),
      action: () => this.setDialog('delete')
    },
  ];

  columns: IGridColumn[] = [
    { prop: 'docName' },
    { prop: 'fileName' },
    { prop: 'docTypeCode', dictCode: UserDictionariesService.DICTIONARY_DOCUMENT_TYPE },
    { prop: 'docNumber' },
    { prop: 'operatorName' },
    { prop: 'comment' }
  ];

  documents: any[] = [];

  dialog: 'add' | 'delete';

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
  ) {
    super();
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => this.columns = this.gridService.setRenderers(columns));
  }

  onSelect(document: any): void {
    this.selectedDocumentId$.next(document.id);
  }

  onDoubleClick(document: any): void {
    this.selectedDocumentId$.next(document.id);
    this.setDialog('edit');
  }
}
