import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ITab } from './header.interface';

@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent implements OnInit, OnDestroy {
  @Input() noMargin = false;
  @Input() tabs: ITab[] = [];

  private tabsPermissionSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    // if no hasPermission prop was passed, count tab as permitted
    this.tabsPermissionSub = combineLatest(
      ...this.tabs.map(tab => tab.hasPermission || of(true)),
    ).subscribe(permissions => {
      // presume that first tab is the default one
      if (!permissions[0]) {
        // find first permitted tab
        let permittedTab,
          index = 0;
        while ((permissions.length - 1) > index && !permissions[index]) {
          index++;
        }
        permittedTab = this.tabs[index];
        // set permission for this index as true,
        // because we are going to navigate to this tab,
        // so it has to be rendered
        permissions[index] = true;
        this.router.navigate([permittedTab.link], { relativeTo: this.route});
      }
      this.tabs = this.tabs.filter((_, index) => permissions[index]);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.tabsPermissionSub) {
      this.tabsPermissionSub.unsubscribe();
    }
  }
}
