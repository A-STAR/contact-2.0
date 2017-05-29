import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { INotification, INotificationTypeEnum } from '../../../core/notifications/notifications.interface';

import { NotificationsActions } from '../../../core/notifications/notifications.actions';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  notifications: Array<INotification>;

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
    this.notificationSubscription = this.notificationsService.notifications
      .subscribe((notifications: Array<INotification>) => this.notifications = notifications);
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }

  getIconClass(notification: INotification): string {
    switch (notification.type) {
      case INotificationTypeEnum.ERROR:
        return 'fa fa-2x fa-times-circle text-danger';
      case INotificationTypeEnum.WARNING:
        return 'fa fa-2x fa-warning text-warning';
      case INotificationTypeEnum.INFO:
        return 'fa fa-2x fa-check-circle text-info';
    }
  }
}
