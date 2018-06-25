import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, first, map, mergeMap } from 'rxjs/operators';

import { ActionsLogService } from '@app/core/actions-log/actions-log.service';
import { HelpService } from '@app/core/help/help.service';
import { LayoutService } from './layout.service';
import { LayoutService as CoreLayoutService } from '@app/core/layout/layout.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { TaskService } from '@app/core/task/task.service';

import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

@Component({
  host: { class: 'full-size' },
  selector: 'app-layout',
  styleUrls: [ './layout.component.scss' ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit, OnDestroy {

  private subscriptions = new SubscriptionBag();

  constructor(
    private actionsLogService: ActionsLogService,
    private coreLayoutService: CoreLayoutService,
    private helpService: HelpService,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.taskService.init();
    const subscription = this.coreLayoutService.currentGuiObject$.pipe(
      filter(Boolean),
      mergeMap(guiObject => {
        const { duration } = guiObject;
        const debtorId = this.routingService.getRouteParam(this.route, 'debtorId');
        return this.actionsLogService.logOpenAction(duration, debtorId);
      }),
    ).subscribe();
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.layoutService.triggerContentDimensionChange();
  }

  @HostListener('window:keydown', [ '$event' ])
  onKeyPress(event: KeyboardEvent): void {
    const { key } = event;
    if (key === 'F1') {
      this.coreLayoutService.currentGuiObject$.pipe(
        first(),
        filter(Boolean),
        map(item => item.docs),
      )
      .subscribe(docs => this.helpService.open(docs));
    }
  }

  @HostListener('window:help', [ '$event' ])
  onHelp(event: KeyboardEvent): boolean {
    event.preventDefault();
    return false;
  }
}
