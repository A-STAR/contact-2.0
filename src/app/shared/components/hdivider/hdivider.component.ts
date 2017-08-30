import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hdivider',
  templateUrl: 'hdivider.component.html',
  styleUrls: [ './hdivider.component.scss' ]
})

export class HDividerComponent implements OnInit {
  @Input() className = 'hdivider-default';

  ngOnInit(): void {
    // attach resize handlers
  }
}
