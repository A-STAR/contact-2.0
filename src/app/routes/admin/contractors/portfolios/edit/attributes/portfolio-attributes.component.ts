import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-portfolio-attributes',
  templateUrl: './portfolio-attributes.component.html',
  styleUrls: ['./portfolio-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioAttributesComponent implements OnInit {

  static COMPONENT_NAME = 'PortfolioAttributesComponent';
  static ENTITY_TYPE_PORTFOLIO = 15;
  entityTypeId: number;
  entityId$: Observable<number>;

  constructor(
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.entityTypeId = PortfolioAttributesComponent.ENTITY_TYPE_PORTFOLIO;
    this.entityId$ = this.route.paramMap.map(params => Number(params.get('portfolioId')));
  }

  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
