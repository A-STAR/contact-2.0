import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  QueryList,
} from '@angular/core';

import { TabViewTabComponent } from './tab.component';

@Component({
  selector: 'app-tabview',
  templateUrl: 'tabview.component.html',
  styleUrls: ['./tabview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TabViewComponent implements AfterContentInit {
  @ContentChildren(TabViewTabComponent) tabs: QueryList<TabViewTabComponent>;

  @Input() noMargin = false;

  @Output() select = new EventEmitter<number>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if no active tab is set, activate the first
    if (!activeTabs.length) {
      this.selectTab(null, this.tabs.filter(tab => !tab.disabled)[0]);
    }
  }

  selectTab(event: MouseEvent, tab: TabViewTabComponent): void {
    if (tab.disabled) {
      return;
    }

    const tabIndex = this.getTabIndex(tab);
    const activeIndex = this.tabs.toArray().findIndex(el => el.active);

    // deactivate all tabs
    this.tabs.toArray().forEach(el => el.active = false);

    // activate the tab the user has clicked on only if the selection is different
    tab.active = true;
    if (activeIndex !== tabIndex) {
      this.select.emit(tabIndex);
    }

    if (!event) {
      return;
    }

    // jQuery
    $(this.el.nativeElement).find('.ripple').remove();
    const $listItem = $(this.el.nativeElement).find('ul').children().eq(tabIndex);
    const posX = $listItem.offset().left;
    const posY = $listItem.offset().top;
    let buttonWidth = $listItem.width();
    let buttonHeight = $listItem.height();

    const listItems = Array.from(this.el.nativeElement.querySelector('ul').children);
    const active = listItems[tabIndex];
    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'ripple');
    this.renderer.appendChild(active, ripple);
    if (buttonWidth >= buttonHeight) {
      buttonHeight = buttonWidth;
    } else {
      buttonWidth = buttonHeight;
    }

    // Get the center of the element
    const x = event.pageX - posX - buttonWidth / 2;
    const y = event.pageY - posY - buttonHeight / 2;
    $(this.el.nativeElement)
      .find('.ripple')
      .css({
        width: buttonWidth,
        height: buttonHeight,
        top: y + 'px',
        left: x + 'px'
      })
      .addClass('rippleEffect');
  }

  private getTabIndex(tab: TabViewTabComponent): number {
    return this.tabs.toArray().findIndex(el => el === tab);
  }
}
