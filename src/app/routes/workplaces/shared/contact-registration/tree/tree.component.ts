import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { catchError, mergeMap } from 'rxjs/operators';

import { IContactRegistrationMode } from '../contact-registration.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-tree',
  styleUrls: [ './tree.component.scss' ],
  templateUrl: './tree.component.html',
})
export class TreeComponent implements OnInit, OnDestroy {
  nodes = [];
  selectedNode = null;
  scenario: string = null;

  private nodesSub: Subscription;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private cdRef: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private workplacesService: WorkplacesService,
  ) {}

  ngOnInit(): void {
    this.nodesSub = combineLatest(this.contactRegistrationService.debtId$, this.contactRegistrationService.contactType$)
      .pipe(
        mergeMap(([ debtId, contactType ]) => this.workplacesService.fetchContactTree(debtId, contactType))
      )
      .subscribe(nodes => {
        this.nodes = nodes;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.nodesSub.unsubscribe();
  }

  get scenarioText(): SafeHtml {
    if (!this.selectedNode) {
      // TODO(d.maltsev): i18n
      return 'Выберите исход';
    }

    if (!this.scenario) {
      // TODO(d.maltsev): i18n
      return 'Пустой сценарий';
    }

    // TODO(d.maltsev): double check for xss vulnerabilities
    return this.domSanitizer.bypassSecurityTrustHtml(this.scenario);
  }

  onNodeSelect(event: any): void {
    this.selectNode(event.node);
  }

  onNodeDoubleClick(node: any): void {
    this.selectNode(node);
    if (node && isEmpty(node.children)) {
      this.contactRegistrationService.mode = IContactRegistrationMode.EDIT;
      this.contactRegistrationService.outcome = node.data;
    }
  }

  onCancelClick(): void {
    this.contactRegistrationService.cancelRegistration();
  }

  private selectNode(node: any): void {
    this.selectedNode = node;
    this.cdRef.markForCheck();
    if (node && isEmpty(node.children)) {
      this.fetchScenario(node.data.id);
    } else {
      this.scenario = null;
      this.cdRef.markForCheck();
    }
  }

  private fetchScenario(nodeId: number): void {
    this.workplacesService
      .fetchContactScenario(this.contactRegistrationService.debtId, this.contactRegistrationService.contactType, nodeId)
      .pipe(
        catchError(() => of(null)),
      )
      .subscribe(scenario => {
        this.scenario = scenario;
        this.cdRef.markForCheck();
      });
  }
}
