import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mass-attr-timezone',
  templateUrl: './timezone.component.html',
  styleUrls: ['./timezone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimezoneComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
