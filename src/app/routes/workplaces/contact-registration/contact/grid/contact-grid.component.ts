import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-grid',
  templateUrl: 'contact-grid.component.html'
})
export class ContactGridComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {

  }
}
