import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ILetterTemplate } from '../letters.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { LettersService } from '@app/routes/utilities/letters/letters.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';

import { DialogFunctions } from '@app/core/dialog';
import { addGridLabel, combineLatestAnd } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-letter-templates-grid',
  templateUrl: './letter-templates-grid.component.html',
})
export class LetterTemplatesGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;

  private selectedTemplate$ = new BehaviorSubject<ILetterTemplate>(null);

  columns: ISimpleGridColumn<ILetterTemplate>[] = [
    { prop: 'id', width: 50 },
    { prop: 'name' },
    { prop: 'fileName' },
    { prop: 'letterTypeCode', dictCode: UserDictionariesService.DICTIONARY_LETTER_TEMPLATE_TYPE },
    { prop: 'serviceTypeCode', dictCode: UserDictionariesService.DICTIONARY_PRINT_SYSTEM_TYPE },
    { prop: 'recipientTypeCode', dictCode: UserDictionariesService.DICTIONARY_MESSAGE_RECIPIENT_TYPE },
    { prop: 'comment' },
  ].map(addGridLabel('routes.utilities.letters.grid'));

  titlebar: ITitlebar = {
    title: 'routes.utilities.letters.titlebar.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON,
buttonType: ButtonType.ADD,
        enabled: this.lettersService.canAdd$,
        action: () => this.onAdd()
      },
      {
        type: TitlebarItemTypeEnum.BUTTON,
buttonType: ButtonType.EDIT,
        action: () => this.onEdit(this.selectedTemplate$.value),
        enabled: combineLatestAnd([
          this.lettersService.canEdit$,
          this.selectedTemplate$.map(Boolean)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON,
buttonType: ButtonType.DELETE,
        action: () => this.setDialog('removeTemplate'),
        enabled: combineLatestAnd([
          this.lettersService.canDelete$,
          this.selectedTemplate$.map(Boolean)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON,
buttonType: ButtonType.DOWNLOAD,
        action: () => this.onExport(),
        enabled: combineLatestAnd([
          this.lettersService.canView$,
          this.selectedTemplate$.map(Boolean)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON,
buttonType: ButtonType.REFRESH,
        action: () => this.fetch(),
        enabled: this.lettersService.canView$
      }
    ]
  };

  dialog: string;

  private _templates: Array<ILetterTemplate> = [];

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private lettersService: LettersService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();

    this.actionSubscription = this.lettersService
      .getAction(LettersService.MESSAGE_LETTER_TEMPLATE_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedTemplate$.next(this.selectedTemplate);
      });
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }

  get templates(): Array<ILetterTemplate> {
    return this._templates;
  }

  get selectedTemplate(): ILetterTemplate {
    return (this._templates || [])
      .find(template => this.selectedTemplate$.value && template.id === this.selectedTemplate$.value.id);
  }

  get selection(): Array<ILetterTemplate> {
    const selectedTemplate = this.selectedTemplate;
    return selectedTemplate ? [ selectedTemplate ] : [];
  }

  get exportUrl(): string {
    if (this.selectedTemplate) {
      return `/letters/templates/${this.selectedTemplate.id}/file`;
    }
  }

  get exportFileName(): string {
    if (this.selectedTemplate) {
      return this.selectedTemplate.fileName;
    }
  }

  onSelect([ template ]: ILetterTemplate[]): void {
    this.selectedTemplate$.next(template);
  }

  onEdit(template: ILetterTemplate): void {
    this.routingService.navigate([ String(template.id) ], this.route);
  }

  onRemove(): void {
    const { id: templateId } = this.selectedTemplate;
    this.lettersService.delete(templateId)
      .subscribe(() => {
        this.setDialog(null);
        this.selectedTemplate$.next(null);
        this.fetch();
      });
  }

  onExport(): void {
    this.downloader.download();
  }

  private onAdd(): void {
    this.routingService.navigate([ 'create' ], this.route);
  }

  private fetch(): void {
    this.lettersService.fetchAll().subscribe(templates => {
      this._templates = templates;
      this.cdRef.markForCheck();
    });
  }
}
