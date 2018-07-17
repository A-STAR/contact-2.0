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
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { ITab } from './header.interface';

import { LayoutService } from '@app/layout/layout.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent implements OnInit, OnDestroy {
  private static MENU_BTN_SPACE = 50;

  private tabHeaders: QueryList<ElementRef>;
  private _tabs: ITab[];

  @ViewChildren('tabHeader') set headers (tabHeaders: QueryList<ElementRef>) {
    this.tabHeaders = tabHeaders;
    this.cdRef.detectChanges();
  }

  @Input()
  set tabs(tabs: ITab[]) {
    if (tabs !== null) {
      const tabsWithPermissions = this.setTabPermissions(tabs);

      this._tabs = tabsWithPermissions;
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

    this.visibleTabsSub = this.tabPerms$
      .pipe(
        map(tabPermissions => tabPermissions.map((p, index) => p && this._tabs[index]).filter(Boolean))
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
    return this._tabs.filter(tab => this.visibleTabs.includes(tab) && !this.feetsInView(tab));
  }

  get tabPerms$(): Observable<boolean[]> {
    return combineLatest(this._tabs.map(t => t.hasPermission));
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
