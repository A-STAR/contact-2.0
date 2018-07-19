import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';

import { ITab } from './header.interface';

import { LayoutService } from '@app/layout/layout.service';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';


@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent implements OnInit, OnDestroy {
  private static MENU_BTN_SPACE = 50;

  private tabHeaders: QueryList<ElementRef>;
  private tabs$ = new BehaviorSubject<ITab[]>([]);

  @ViewChildren('tabHeader') set headers (tabHeaders: QueryList<ElementRef>) {
    this.tabHeaders = tabHeaders;
    this.cdRef.detectChanges();
  }

  @Input()
  set tabs(tabs: ITab[]) {
    if (tabs !== null) {
      const tabsWithPermissions = this.setTabPermissions(tabs);

      this.tabs$.next(tabsWithPermissions);
    }
  }

  @Input() noMargin = false;

  @Output() tabClose = new EventEmitter<number>();
  private visibleTabs$ = new BehaviorSubject<ITab[]>([]);
  private visibleTabsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    private layoutService: LayoutService,
  ) { }

  ngOnInit(): void {
    this.layoutService.contentDimension$
      .filter(Boolean)
      .subscribe(() => this.cdRef.markForCheck());

    this.visibleTabsSub = this.tabs$
      .pipe(
        switchMap(tabs => combineLatest(tabs.map(t => t.hasPermission))),
        map(tabPermissions => tabPermissions.map((p, index) => p && this.tabs$.value[index]).filter(Boolean))
      )
      .subscribe(tabs => {
        this.visibleTabs$.next(tabs);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.visibleTabsSub.unsubscribe();
  }

  closeTab(event: MouseEvent, id: number): void {
    event.stopPropagation();
    this.tabClose.emit(id);
  }

  get visibleTabs(): ITab[] {
    return this.visibleTabs$.value;
  }

  get menuTabs(): ITab[] {
    return this.tabs$.value.filter(tab => this.visibleTabs.includes(tab) && !this.feetsInView(tab));
  }

  feetsInView(tab: ITab): boolean {
    const visibleTabs = this.visibleTabs;
    const tabIndex = visibleTabs.indexOf(tab);
    const visibleHeaders = this.tabHeaders && this.tabHeaders.toArray();

    if (!visibleHeaders || visibleHeaders.length !== visibleTabs.length) {
      return false;
    }

    const headerWidth = this.tabHeaderWidth - TabHeaderComponent.MENU_BTN_SPACE;

    const tabHeader = {
      left: visibleHeaders[tabIndex].nativeElement.offsetLeft,
      width: visibleHeaders[tabIndex].nativeElement.clientWidth
    };

    return tabHeader.left + tabHeader.width < headerWidth;
  }

  private get tabHeaderWidth(): any {
    return this.el.nativeElement.querySelector('ul').clientWidth;
  }

  private setTabPermissions(tabs: ITab[]): ITab[] {

    const tabsWithPermissions: ITab[] = tabs.map((tab: ITab) => {

      if (!tab.hasPermission) {
        tab.hasPermission = of(true);
      }

      return tab;
    });

    return tabsWithPermissions;
  }
}
