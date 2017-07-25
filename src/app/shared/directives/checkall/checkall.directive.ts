import { Directive, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: '[checkAll]'
})
export class CheckallDirective {

  constructor(private el: ElementRef) {
    const $element = $(this.el.nativeElement);

    $element.on('change', function(): void {
      const index = $element.index() + 1;
      const checkbox = $element.find('input[type="checkbox"]');
      const table = $element.parents('table');
      // Make sure to affect only the correct checkbox column
      table.find('tbody > tr > td:nth-child(' + index + ') input[type="checkbox"]')
          .prop('checked', checkbox[0].checked);
    });
  }

}
