import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IContactLog } from '../contact-log.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ContactLogService } from '../contact-log.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

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

  selectedChanged$ = new BehaviorSubject<boolean>(false);
  rowCount: number;
  contactLogList: IContactLog[];
  readonly canView$ = this.userPermissionsService.has('CONTACT_LOG_VIEW');

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
}
