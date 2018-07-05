import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';

import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { LayoutService } from '@app/core/layout/layout.service';
import { PledgeCardCreatePropertyService } from './create-property.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';
import { PropertySearchComponent } from '@app/routes/workplaces/shared/property-search/property-search.component';

import { DialogFunctions } from '@app/core/dialog';
import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

import { createPropertyLayout } from './create-property.layout';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    PledgeCardCreatePropertyService,
  ],
  selector: 'app-pledge-card-create-property',
  templateUrl: 'create-property.component.html'
})
export class PledgeCardCreatePropertyComponent extends DialogFunctions implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;
  @ViewChild(PropertySearchComponent) propertySearch: PropertySearchComponent;

  @ViewChild('propertyClearButton', { read: TemplateRef }) propertyClearButtonTemplate: TemplateRef<any>;
  @ViewChild('propertyTitlebar',    { read: TemplateRef }) propertyTitlebarTemplate:    TemplateRef<any>;

  readonly layoutConfig = createPropertyLayout;

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contract ID (link between debtor, pledgor and property)
   */
  readonly contractId = Number(this.paramMap.get('contractId'));

  readonly debtId = Number(this.paramMap.get('debtId'));

  readonly debtorId = Number(this.paramMap.get('debtorId'));

  readonly pledgorId = Number(this.paramMap.get('pledgorId'));

  readonly pledgorRole = 3;

  readonly phoneContactType = 1;

  readonly property$ = this.pledgeCardCreatePropertyService.property$;

  readonly propertyTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.property.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPropertySearch(),
      },
    ]
  };

  readonly isSubmitDisabled$ = new BehaviorSubject<boolean>(false);

  readonly formData$ = this.property$.pipe(
    map(property => ({
      property: property ? property : {},
    })),
  );

  dialog: string;

  templates: Record<string, TemplateRef<any>>;

  private subscriptionBag = new SubscriptionBag();

  constructor(
    private layoutService: LayoutService,
    private pledgeCardCreatePropertyService: PledgeCardCreatePropertyService,
    private pledgeService: PledgeService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.templates = {
      propertyClearButton: this.propertyClearButtonTemplate,
      propertyTitlebar: this.propertyTitlebarTemplate,
    };

    const routerSubscription = this.layoutService.navigationEnd$.subscribe(() => {
      this.layout.resetAndEnableAll();
      this.isSubmitDisabled$.next(false);
    });
    this.subscriptionBag.add(routerSubscription);
  }

  ngAfterViewInit(): void {
    const propertySubscription = this.property$.subscribe(property => {
      this.layout.toggleFormGroup('property', !property);
    });
    this.subscriptionBag.add(propertySubscription);

    const disabledSubscription = combineLatest(
      this.property$,
      this.layout.canSubmit('property'),
      this.layout.isValid('propertyValue'),
    )
    .subscribe(([ property, propertyValid, propertyValueValid ]) => {
      const canSubmitProperty = property
        ? true
        : propertyValid;
      const isValid = canSubmitProperty && propertyValueValid;
      this.isSubmitDisabled$.next(!isValid);
    });
    this.subscriptionBag.add(disabledSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptionBag.unsubscribe();
  }

  onPropertySearchSubmit(): void {
    this.pledgeCardCreatePropertyService.selectProperty(this.propertySearch.property);
    this.closeDialog();
  }

  onSave(): void {
    const property = this.layout.getData('property');
    const propertyValue = this.layout.getData('propertyValue');
    this.pledgeCardCreatePropertyService
      .createProperty(this.debtId, this.contractId, this.pledgorId, property, propertyValue)
      .subscribe(() => this.onSuccess());
  }

  onBack(): void {
    this.routingService.navigateToUrl('/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit');
  }

  onPropertyFormClear(): void {
    this.pledgeCardCreatePropertyService.selectProperty(null);
    this.layout.resetForm('property');
    this.layout.resetForm('propertyValue');
  }

  private onSuccess(): void {
    this.pledgeService.dispatchPledgeSavedMessage();
    this.onBack();
  }

  private openPropertySearch(): void {
    this.setDialog('property-search');
  }
}
