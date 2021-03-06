import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { catchError, mergeMap, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';
import { IContactRegistrationMode } from '../contact-registration.interface';

import { CallService } from '@app/core/calls/call.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { isEmpty } from '@app/core/utils';
import { UseIntermediateStatusEnum } from '@app/core/calls/call.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-tree',
  styleUrls: [ './tree.component.scss' ],
  templateUrl: './tree.component.html',
})
export class TreeComponent implements OnInit, OnDestroy {
  nodes = [];
  scenario: string = null;

  readonly selectedNode$ = new BehaviorSubject<ITreeNode>(null);

  private nodesSub: Subscription;
  private selectedNodeSub: Subscription;
  private treeIntermediateSub: Subscription;

  constructor(
    private callService: CallService,
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
        this.scenario = null;
        this.selectedNode$.next(null);
        this.cdRef.markForCheck();
      });

    this.selectedNodeSub = this.selectedNode$
      .subscribe(node => {
        if (node && isEmpty(node.children)) {
          this.fetchScenario(node.data.id);
        } else {
          this.scenario = null;
          this.cdRef.markForCheck();
        }

        this.cdRef.markForCheck();
      });

    this.treeIntermediateSub = combineLatest(
      this.callService.pbxState$,
      this.selectedNode$,
      this.callService.settings$,
      this.callService.predictiveCall$,
      this.callService.postCall$
    )
    .pipe(
      filter(([ _, node ]) => !!node),
      filter(([ _state, _node, _settings, predictiveCall, postCall ]) => predictiveCall || postCall),
      filter(([ _, node, settings ]) =>
        settings.callResultUseIntermediateCodeMode === UseIntermediateStatusEnum.ALL_NODE ||
          settings.callResultUseIntermediateCodeMode === UseIntermediateStatusEnum.LAST_NODE_ONLY && !node.children
      )
    )
    .subscribe(([ state, node ]) => this.callService.sendContactTreeIntermediate(
      state.payload.pbxCallId,
      node.data.code,
      state.payload.phoneId,
      state.payload.debtId
    ));
  }

  ngOnDestroy(): void {
    this.nodesSub.unsubscribe();
    this.selectedNodeSub.unsubscribe();
    this.treeIntermediateSub.unsubscribe();
  }

  get selectedNode(): ITreeNode {
    return this.selectedNode$.value;
  }

  get scenarioText(): { text: SafeHtml, translate: boolean } {
    if (!this.selectedNode) {
      return {
        text: 'routes.workplaces.shared.contactRegistration.tree.selectOutcome',
        translate: true,
      };
    }

    if (!this.scenario) {
      return {
        text: 'routes.workplaces.shared.contactRegistration.tree.emptyScenario',
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
    this.selectedNode$.next(event.node);
  }

  onNodeDoubleClick(node: any): void {
    this.selectedNode$.next(node);
    if (node && isEmpty(node.children)) {
      this.contactRegistrationService.mode = IContactRegistrationMode.EDIT;
      this.contactRegistrationService.outcome = node.data;
    }
  }

  onCancelClick(): void {
    this.contactRegistrationService.cancelRegistration();
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
