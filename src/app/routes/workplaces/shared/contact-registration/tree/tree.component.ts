import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
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
    this.nodesSub = this.contactRegistrationService.params$
      .pipe(
        mergeMap(params => {
          return params
            ? this.workplacesService.fetchContactTree(params.debtId, params.contactType)
            : of([]);
        })
      )
      .subscribe(nodes => {
        this.nodes = nodes;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.nodesSub.unsubscribe();
  }

  get scenarioText(): { text: SafeHtml, translate: boolean } {
    if (!this.selectedNode) {
      return {
        text: 'modules.contactRegistration.tree.selectOutcome',
        translate: true,
      };
    }

    if (!this.scenario) {
      return {
        text: 'modules.contactRegistration.tree.emptyScenario',
        translate: true,
      };
    }

    // TODO(d.maltsev): double check for xss vulnerabilities
    return {
      text: this.domSanitizer.bypassSecurityTrustHtml(this.scenario),
      translate: false,
    };
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
