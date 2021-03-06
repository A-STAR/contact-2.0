import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IContactLog } from '../contact-log.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { ContactLogService } from '../contact-log.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { isEmpty } from '@app/core/utils';

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

  rowCount: number;
  contactLogList: IContactLog[];
  readonly canView$ = this.userPermissionsService.has('CONTACT_LOG_VIEW');
  readonly hasSelection$ = new BehaviorSubject<boolean>(false);

  toolbar: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.onEdit(this.selected[0]),
        enabled: combineLatest(
          this.canView$,
          this.hasSelection$
        )
        .map(([canView, selected]) => canView && selected)
      }
    ]
  };

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
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.contactLogService
      .fetchGridData(this.personId, this.callCenter, filters, params)
      .subscribe((response: IAGridResponse<IContactLog>) => {
        this.contactLogList = [ ...response.data ];
        this.rowCount = response.total;
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

  onSelect(logs: IContactLog[]): void {
    const log = isEmpty(logs) ? null : logs[0];
    this.hasSelection$.next(Boolean(log));
  }

  onEdit(contactLog: IContactLog): void {
    const { contactId, contactType } = contactLog;
    const url = this.callCenter
      ? `contactLog/${this.debtId}/${contactId}/contactLogType/${contactType}`
      : `contactLog/${contactId}/contactLogType/${contactType}`;

    this.routingService.navigate([ url ], this.route);
  }

}
