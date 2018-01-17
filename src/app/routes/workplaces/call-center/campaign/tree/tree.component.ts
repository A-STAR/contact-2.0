import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { WorkplacesService } from '../../../workplaces.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-call-center-tree',
  styleUrls: [ './tree.component.scss' ],
  templateUrl: './tree.component.html',
})
export class TreeComponent implements OnInit {
  nodes = [];

  private debtId = 1;
  private contactTypeCode = 1;

  constructor(
    private cdRef: ChangeDetectorRef,
    private workplacesService: WorkplacesService,
  ) {}

  ngOnInit(): void {
    this.fetchNodes();
  }

  onNodeSelect(event: any): void {
    console.log(event);
  }

  private fetchNodes(): void {
    this.workplacesService.fetchContactTree(this.debtId, this.contactTypeCode).subscribe(nodes => {
      this.nodes = nodes;
      this.cdRef.markForCheck();
    });
  }
}
