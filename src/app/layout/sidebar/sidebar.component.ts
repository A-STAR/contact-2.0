import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { GuiObjectsService } from '../../core/gui-objects/gui-objects.service';
import { SettingsService } from '../../core/settings/settings.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuItems: any = [];

  private menuSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private menuService: GuiObjectsService,
    private router: Router,
    public settings: SettingsService,
  ) {

  }

  ngOnInit(): void {
    this.menuSubscription = this.menuService
      .selectedMenuItem
      .subscribe(menuItem => {
        this.menuItems = menuItem.children;
        if (menuItem.link === '/home') {
          this.router.navigate(['home']);
        }
        this.cdRef.markForCheck();
      });
    this.menuService.menuItems
      .pipe(first())
      .subscribe(menuItems => {
        const selectedItem = this.menuService.findItemByLink(menuItems, this.router.url);
        if (selectedItem) {
          this.menuService.selectMenuItem(selectedItem);
        }
      });
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
  }

  // Close menu collapsing height
  closeMenu(elem: any): void {
      elem.height(elem[0].scrollHeight);
      // and move to zero to collapse
      elem.height(0);
      elem.removeClass('opening');
  }

  listenForExternalClicks(): void {
    const $doc = $(document).on('click.sidebar', (e) => {
      if (!$(e.target).parents('.aside').length) {
        this.removeFloatingNav();
        $doc.off('click.sidebar');
      }
    });
  }

  removeFloatingNav(): void {
    $('.nav-floating').remove();
  }

  isSidebarCollapsedText(): boolean {
    return this.settings.layout.isCollapsedText;
  }
  isEnabledHover(): boolean {
    return this.settings.layout.asideHover;
  }
}
