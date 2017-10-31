import { Component, OnInit } from '@angular/core';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';

@Component({
  selector: 'app-pledge-card',
  templateUrl: './pledge-card.component.html'
})
export class PledgeCardComponent implements OnInit {

  constructor(
    private contentTabService: ContentTabService,
  ) {}

  ngOnInit(): void {
  }

  get canSubmit(): boolean {
    return false;
  }

  onSubmit(): void {
  }

  onBack(): void {
    this.contentTabService.back();
  }
}
