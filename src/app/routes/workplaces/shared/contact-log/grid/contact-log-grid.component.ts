import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { tap, map, filter } from 'rxjs/operators';

import { IAGridResponse, IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { IContactLog } from '../contact-log.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';

import { ContactLogService } from '../contact-log.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-contact-log-grid',
  templateUrl: './contact-log-grid.component.html',
})
export class ContactLogGridComponent implements OnInit, OnDestroy {
  @Input() callCenter = false;
  @Input() debtId: number;
  @Input() hideToolbar = false;
  @Input() personId: number;

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IContactLog>;
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;

  selectedChanged$ = new BehaviorSubject<boolean>(false);
  rowCount: number;
  contactLogList: IContactLog[];
  readonly canView$ = this.userPermissionsService.has('CONTACT_LOG_VIEW');

  actions: IMetadataAction[] = [
  ];

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selected[0]),
      enabled: combineLatest(
        this.canView$,
        this.selectedChanged$
      )
      .map(([canView, selected]) => canView && selected)
    }
  ];

  private selectionSubpscription: Subscription;
  private viewCommentUpdate: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {

    this.viewCommentUpdate = this.contactLogService.getPayload(ContactLogService.COMMENT_CONTACT_LOG_SAVED)
      .subscribe(() => {
        this.onRequest();
        this.cdRef.markForCheck();
      });

    this.selectionSubpscription = this.selectedChanged$
      .pipe(
        tap(() => this.actions = []),
        map(() => this.selected),
        filter(selection => selection && selection.length === 1),
        filter(selection => selection[0].contactType === 5)
      )
      .subscribe(() => {
        this.actions = [
          this.contactLogService.letteExportAction
        ];
      });
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.contactLogService
      .fetchGridData(this.personId, this.callCenter, filters, params)
      .subscribe((response: IAGridResponse<IContactLog>) => {
        this.contactLogList = [ ...response.data ];
        this.rowCount = response.total;
        this.selectedChanged$.next(this.hasSelection);
        this.cdRef.markForCheck();
      });
  }


  ngOnDestroy(): void {
    this.selectionSubpscription.unsubscribe();
    this.viewCommentUpdate.unsubscribe();
  }

  get selected(): IContactLog[] {
    return (this.grid && this.grid.selection) || [];
  }

  get hasSelection(): boolean {
    return !!this.selected && !!this.selected.length;
  }

  onSelect(): void {
    this.selectedChanged$.next(true);
  }

  onEdit(contactLog: IContactLog): void {
    const { contactId, contactType } = contactLog;
    const url = this.callCenter
      ? `contactLog/${this.debtId}/${contactId}/contactLogType/${contactType}`
      : `contactLog/${contactId}/contactLogType/${contactType}`;

    this.routingService.navigate([ url ], this.route);
  }

  onAction(action: IAGridAction): void {
    switch (action.metadataAction.action) {
      case this.contactLogService.letteExportAction.action:
        this.exportLetter(action.selection.node.data);
    }
  }

  private exportLetter(contactLog: IContactLog): void {
    this.downloader.name = contactLog.messageTemplate;
    this.downloader.url =
      `/debts/${contactLog.debtId}/letter/${contactLog.contactId}/file?callCenter=${this.callCenter ? 1 : 0}`;
    this.downloader.download();
  }
}
