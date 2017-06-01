import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IMenuItem } from '../../core/menu/menu.interface';

import { MenuService } from '../../core/menu/menu.service';
import { SettingsService } from '../../core/settings/settings.service';
import { NotificationsService } from '../../core/notifications/notifications.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuItems: Array<IMenuItem>;

  private routeDataSubscription: Subscription;

  constructor(
    private menuService: MenuService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
  ) {
    this.routeDataSubscription = this.route.data.subscribe(
      data => this.menuItems = data.menu,
      () => notificationsService.error('sidebar.messages.loadError')
    );
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      // close any submenu opened when route changes
      this.removeFloatingNav();
      // scroll view to top
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): void {
    this.routeDataSubscription.unsubscribe();
  }

  toggleSubmenuClick(event: UIEvent): void {
    if (!this.isSidebarCollapsed() && !this.isSidebarCollapsedText() && !this.isEnabledHover()) {
      event.preventDefault();

      const target = $(event.target || event.srcElement || event.currentTarget);
      let ul;
      let anchor = target;

      // find the UL
      if (!target.is('a')) {
        anchor = target.parent('a').first();
      }
      ul = anchor.next();

      // hide other submenus
      const parentNav = ul.parents('.sidebar-subnav');
      $('.sidebar-subnav').each((idx, el) => {
        const $el = $(el);
        // if element is not a parent or self ul
        if (!$el.is(parentNav) && !$el.is(ul)) {
          this.closeMenu($el);
        }
      });

      // abort if not UL to process
      if (!ul.length) {
        return;
      }

      // any child menu should start closed
      ul.find('.sidebar-subnav').each((idx, el) => {
        this.closeMenu($(el));
      });

      // toggle UL height
      if (parseInt(ul.height(), 0)) {
        this.closeMenu(ul);
      } else {
        // expand menu
        ul.on('transitionend', () => {
            ul.height('auto').off('transitionend');
        }).height(ul[0].scrollHeight);
        // add class to manage animation
        ul.addClass('opening');
      }
    }
  }

  // Close menu collapsing height
  closeMenu(elem: any): void {
      elem.height(elem[0].scrollHeight);
      // and move to zero to collapse
      elem.height(0);
      elem.removeClass('opening');
  }

  toggleSubmenuHover(event: UIEvent): void {
    const self = this;
    if (this.isSidebarCollapsed() || this.isSidebarCollapsedText() || this.isEnabledHover()) {
      event.preventDefault();

      this.removeFloatingNav();

      const target = $(event.target || event.srcElement || event.currentTarget);
      let ul;
      let anchor = target;
      // find the UL
      if (!target.is('a')) {
        anchor = target.parent('a');
      }
      ul = anchor.next();

      if (!ul.length) {
        // if not submenu return
        return;
      }

      const $aside = $('.aside');
      // for top offset calculation
      const $asideInner = $aside.children('.aside-inner');
      const $sidebar = $asideInner.children('.sidebar');
      const padding = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
      const itemTop = ((anchor.parent().position().top) + padding) - $sidebar.scrollTop();

      const floatingNav = ul.clone().appendTo($aside);
      const vwHeight = $(window).height();

      // let itemTop = anchor.position().top || anchor.offset().top;

      floatingNav
        // necesary for demo if switched between normal/collapsed mode
        .removeClass('opening')
        .addClass('nav-floating')
        .css({
          position: this.settings.layout.isFixed ? 'fixed' : 'absolute',
          top: itemTop,
          bottom: (floatingNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
        });

      floatingNav
        .on('mouseleave', () => { floatingNav.remove(); })
        .find('a').on('click', function(e: any): void {
          // prevents page reload on click
          e.preventDefault();
          // get the exact route path to navigate
          self.router.navigate([$(this).attr('route')]);
        });

      this.listenForExternalClicks();
    }
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

  isSidebarCollapsed(): boolean {
    return this.settings.layout.isCollapsed;
  }
  isSidebarCollapsedText(): boolean {
    return this.settings.layout.isCollapsedText;
  }
  isEnabledHover(): boolean {
    return this.settings.layout.asideHover;
  }
}
