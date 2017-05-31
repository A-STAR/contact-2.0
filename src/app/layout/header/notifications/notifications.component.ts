import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { INotification, NotificationTypeEnum } from '../../../core/notifications/notifications.interface';

import { NotificationsActions } from '../../../core/notifications/notifications.actions';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  @Input() notifications: Array<INotification>;
  @Input() filters: Array<boolean>;

  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  filterTypes: Array<NotificationTypeEnum> = [
    NotificationTypeEnum.INFO,
    NotificationTypeEnum.WARNING,
    NotificationTypeEnum.ERROR,
    NotificationTypeEnum.DEBUG,
  ];

  constructor(private notificationsActions: NotificationsActions) {}

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  getIconClass(type: NotificationTypeEnum): string {
    switch (type) {
      case NotificationTypeEnum.DEBUG: return 'fa fa-bug text-danger';
      case NotificationTypeEnum.ERROR: return 'fa fa-times-circle text-danger';
      case NotificationTypeEnum.WARNING: return 'fa fa-warning text-warning';
      case NotificationTypeEnum.INFO: return 'fa fa-check-circle text-info';
    }
  }

  getTranslationKey(type: NotificationTypeEnum): string {
    switch (type) {
      case NotificationTypeEnum.DEBUG: return 'notifications.types.debug';
      case NotificationTypeEnum.ERROR: return 'notifications.types.error';
      case NotificationTypeEnum.WARNING: return 'notifications.types.warning';
      case NotificationTypeEnum.INFO: return 'notifications.types.info';
    }
  }

  onFilterChange(type: NotificationTypeEnum, event: MouseEvent): void {
    this.notificationsActions.filter(type, (event.target as HTMLInputElement).checked);
  }

  onDismissClick(index: number): void {
    this.notificationsActions.remove(index);
  }

  onClearClick(): void {
    this.notificationsActions.reset();
    this.close();
  }

  onCloseClick(): void {
    this.close();
  }

  private close(): void {
    this.onClose.emit();
  }
}
