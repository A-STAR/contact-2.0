import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NotificationsService } from '../../../core/notifications/notifications.service';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: [ './data-view.component.scss' ]
})
export class DataViewComponent implements OnInit, OnDestroy {
  @Input() canView: Observable<boolean>;
  @Input() permission: string;

  @Output() onChange = new EventEmitter<boolean>();

  private subscription: Subscription;

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.subscription = this.canView
      .distinctUntilChanged()
      .subscribe(canView => {
        this.onChange.emit(canView);
        if (!canView) {
          this.notificationsService.error({ message: 'roles.permissions.messages.no_view', param: { permission: this.permission } }, true);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
