import {
  AfterContentInit,
  ChangeDetectorRef,
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

import { SleekTabComponent } from './tab.component';

@Component({
  selector: 'app-sleek-tabstrip',
  templateUrl: 'tabstrip.component.html',
  styleUrls: ['./tabstrip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SleekTabstripComponent implements AfterContentInit {
  @ContentChildren(SleekTabComponent) tabs: QueryList<SleekTabComponent>;

  @Output() select = new EventEmitter<number>();

  constructor(
    private cdRef: ChangeDetectorRef,
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

  selectTab(event: MouseEvent, tab: SleekTabComponent): void {
    if (tab.disabled) {
      return;
    }
    // deactivate all tabs
    this.tabs.toArray().forEach(el => el.active = false);
    // activate the tab the user has clicked on
    tab.active = true;
    const tabIndex = this.getTabIndex(tab);
    this.select.emit(tabIndex);
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
    console.log(event.pageY, posY, buttonHeight);
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

  private getTabIndex(tab: SleekTabComponent): number {
    return this.tabs.toArray().findIndex(el => el === tab);
  }
}
