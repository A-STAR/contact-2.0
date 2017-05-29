import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  INotification,
  INotificationFilters,
  INotificationServiceState,
  INotificationType,
} from '../../../core/notifications/notifications.interface';

import { NotificationsActions } from '../../../core/notifications/notifications.actions';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  notifications: Array<INotification>;

  filters: INotificationFilters;

  private notificationSubscription: Subscription;

  constructor(
    private notificationsActions: NotificationsActions,
    private notificationsService: NotificationsService
  ) {}

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  ngOnInit(): void {
    this.notificationSubscription = this.notificationsService.state
      .subscribe((state: INotificationServiceState) => {
        this.filters = state.filters;
        this.notifications = state.notifications;
      });
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }

  getIconClass(notification: INotification): string {
    switch (notification.type) {
      case 'ERROR':
        return 'fa fa-2x fa-times-circle text-danger';
      case 'WARNING':
        return 'fa fa-2x fa-warning text-warning';
      case 'INFO':
        return 'fa fa-2x fa-check-circle text-info';
    }
  }

  onFilterChange(type: INotificationType, event: MouseEvent): void {
    // FIXME
    this.notificationsActions.filter(type, (event.target as HTMLInputElement).checked);
  }
}
