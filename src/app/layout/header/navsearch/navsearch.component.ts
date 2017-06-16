import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navsearch',
  templateUrl: './navsearch.component.html',
  styleUrls: ['./navsearch.component.scss']
})
export class NavsearchComponent implements OnInit, OnChanges {

  @Input() visible: boolean;
  @Output() onclose = new EventEmitter<boolean>();
  term: string;

  constructor(private elem: ElementRef) { }

  ngOnInit(): void {
    $(document)
      .on('keyup', event => {
        if (event.keyCode === 27) {
          this.closeNavSearch();
        }
      })
      .on('click', event => {
        if (!$.contains(this.elem.nativeElement, event.target)) {
          this.closeNavSearch();
        }
      });
  }

  closeNavSearch(): void {
    this.visible = false;
    this.onclose.emit();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['visible'].currentValue === true) {
      this.elem.nativeElement.querySelector('input').focus();
    }
  }

  handleForm(): void {
    console.log('Form submit: ' + this.term);
  }
}
