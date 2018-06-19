import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, filter } from 'rxjs/operators';
// import { switchMap, toArray, map, filter } from 'rxjs/operators';

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

  tabs$: Observable<ITab[]> = combineLatest<ITab>(
    ...this.debtorService.debtors
      .map((debtor: [number, number]): Observable<ITab> => this.getTab(debtor)),
  );

  // tabs$: Observable<ITab[]> = this.debtorService.debtors$.pipe(
  //   switchMap((debtors: Array<[number, number]>): Observable<ITab>[] =>
  //     debtors.map(this.getTab.bind(this))
  //   ),
  //   switchMap((tab: Observable<ITab>): Observable<ITab> => tab),
  //   toArray(),
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
      const debtId   = Number(paramMap.get('debtId'));
      this.onDebtorIdChange(debtorId);
      this.onDebtIdChange(debtId);
      this.debtorService.addTab(debtorId, debtId);
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
    this.cdRef.markForCheck();
  }

  onNavigationEnd(event: NavigationEnd): void {
    const urlSegment = event.url.split('/').slice(3, 7);

    const debtorIdx = urlSegment.indexOf('debtor');
    const debtIdx = urlSegment.indexOf('debt');

    if (debtorIdx !== -1) {
      const debtorId = Number(urlSegment[debtorIdx + 1]);
      this.onDebtorIdChange(debtorId);
    }

    if (debtIdx !== -1) {
      const debtId = Number(urlSegment[debtIdx + 1]);
      this.onDebtIdChange(debtId);
    }
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
