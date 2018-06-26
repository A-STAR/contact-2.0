import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, switchMap, tap, filter } from 'rxjs/operators';

import { Person } from '@app/entities';
import { ITab } from '@app/shared/components/layout/tabview/header/header.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtorService } from './debtor.service';
import { RepositoryService } from '@app/core/repository/repository.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-size' },
  providers: [ContactRegistrationService],
  selector: 'app-debtor',
  styleUrls: [ './debtor.component.scss' ],
  templateUrl: './debtor.component.html',
})
export class DebtorComponent implements OnInit, OnDestroy {

  tabs$: Observable<ITab[]> = this.debtorService.debtors$.pipe(
    map((debtors: Array<[number, number]>): Array<Observable<ITab>> =>
      debtors.map((debtor: [number, number]): Observable<ITab> => this.getTab(debtor))
    ),
    switchMap(
      (tabs: Array<Observable<ITab>>): Observable<ITab[]> =>
        tabs.length ? combineLatest(tabs) : of([])
    ),
    tap(() => this.cdRef.markForCheck()),
  );

  // tabs$: Observable<ITab[]> = this.debtorService.debtors$.pipe(
  //   switchMap((debtors: Array<[number, number]>): Observable<ITab[]> =>
  //     combineLatest(
  //       debtors.length
  //         ? debtors.map((debtor: [number, number]): Observable<ITab> => this.getTab(debtor))
  //         : of([])
  //     )
  //   ),
  // );

  readonly displayContactRegistration$ = this.contactRegistrationService.isActive$;

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private debtorService: DebtorService,
    private repositoryService: RepositoryService,
  ) {}

  ngOnInit(): void {
    const routeIdSubscription = this.route.paramMap.subscribe(paramMap => {
      const debtorId = Number(paramMap.get('debtorId'));
      const debtId = Number(paramMap.get('debtId'));
      this.onDebtorIdOrDebtIdChange(debtorId, debtId);
      this.onDebtorIdChange(debtorId);
      this.onDebtIdChange(debtId);
      this.cdRef.markForCheck();
    });

    this.subscription.add(routeIdSubscription);

    const routeNavigateSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => this.onNavigationEnd(event as NavigationEnd));

    this.subscription.add(routeNavigateSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNavigationEnd(event: NavigationEnd): void {
    const urlSegment = event.url.split('/').slice(3, 7);

    const debtorIdx = urlSegment.indexOf('debtor');
    const debtIdx = urlSegment.indexOf('debt');
    const newDebtorId = debtorIdx !== -1;
    const newDebtId = debtIdx !== -1;

    if (newDebtorId || newDebtId) {
      const debtorId = Number(urlSegment[debtorIdx + 1]);
      const debtId = Number(urlSegment[debtIdx + 1]);

      this.onDebtorIdOrDebtIdChange(debtorId, debtId);

      if (newDebtorId) {
        this.onDebtorIdChange(debtorId);
      }

      if (newDebtId) {
        this.onDebtIdChange(debtId);
      }

    }
  }

  getTab([ id, debt ]: [ number, number ]): Observable<ITab> {
    const link = `/app/workplaces/debtor/${id}/debt/${debt}`;

    return this.repositoryService
      .fetch(Person, { id })
      .pipe(
        map((persons: Person[]): ITab => {
          const [ person ] = persons;
          const title = `${person.lastName} ${person.firstName} ${person.middleName}`;

          return <ITab>{ id, title, link, closable: true };
        }),
      );
  }

  onTabClose(debtorId: number): void {
    this.debtorService.removeTab(debtorId);
    this.router.navigate(['/app/workplaces/debt-processing']);
    this.cdRef.markForCheck();
  }

  private onDebtorIdOrDebtIdChange(debtorId: number, debtId: number): void {
    this.debtorService.openTab(debtorId, debtId);
  }

  private onDebtorIdChange(debtorId: number): void {
    if (this.debtorService.debtorId$.value !== debtorId) {
      this.debtorService.debtorId$.next(debtorId);
    }
  }

  private onDebtIdChange(debtId: number): void {
    if (this.debtorService.debtId$.value !== debtId) {
      this.debtorService.debtId$.next(debtId);
    }
  }
}
