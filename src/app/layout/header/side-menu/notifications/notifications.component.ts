import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Output,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IFilters, INotification, NotificationTypeEnum } from '../../../../core/notifications/notifications.interface';

import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  filterTypes: Array<NotificationTypeEnum> = [
    NotificationTypeEnum.INFO,
    NotificationTypeEnum.WARNING,
    NotificationTypeEnum.ERROR,
    NotificationTypeEnum.DEBUG,
  ];

  filters: IFilters;
  notifications: INotification[];

  filtersSub: Subscription;
  notificationsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.notificationsSub = this.notificationsService.notifications
      .subscribe(notifications => {
        this.notifications = notifications;
        this.cdRef.detectChanges();
      });

    this.filtersSub = this.notificationsService.filters
      .subscribe((filters: IFilters) => {
        this.filters = filters;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.notificationsSub.unsubscribe();
    this.filtersSub.unsubscribe();
  }

  hasFilters(): boolean {
    return !!Object.keys(this.filters || {}).length;
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  getIconClass(type: NotificationTypeEnum): string {
    switch (type) {
      case NotificationTypeEnum.DEBUG: return 'fa fa-bug text-danger';
      case NotificationTypeEnum.ERROR: return 'fa fa-exclamation-circle text-danger';
      case NotificationTypeEnum.WARNING: return 'fa fa-warning text-warning';
      case NotificationTypeEnum.INFO: return 'fa fa-info-circle text-info';
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

  onFilterChange(type: NotificationTypeEnum, value: boolean): void {
    this.notificationsService.filter(type, value);
  }

  onDismiss(index: number): void {
    this.notificationsService.remove(index);
  }

  onClear(): void {
    this.notificationsService.reset();
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }
}
