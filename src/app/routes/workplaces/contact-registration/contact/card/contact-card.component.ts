import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-card',
  templateUrl: 'contact-card.component.html'
})
export class ContactCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {

  }
}
