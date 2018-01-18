import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-contractor-attributes',
  templateUrl: './contractor-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorAttributesComponent implements OnInit {
  static ENTITY_TYPE_CONTRACTOR = 13;

  entityTypeId: number;
  entityId$: Observable<number>;

  constructor(
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.entityTypeId = ContractorAttributesComponent.ENTITY_TYPE_CONTRACTOR;
    this.entityId$ = this.route.paramMap.map(params => Number(params.get('contractorId')));
  }

  onBack(): void {
    this.location.back();
  }

}
