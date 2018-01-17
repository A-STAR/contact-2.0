import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IOption } from '../../../../core/converter/value-converter.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { AccordionService } from '../../../../shared/components/accordion/accordion.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { OutcomeService } from './outcome.service';
import { UserTemplatesService } from '../../../../core/user/templates/user-templates.service';
import { WorkplacesService } from '../../workplaces.service';

import { isEmpty, valuesToOptions, invert } from '../../../../core/utils';

@Component({
  selector: 'app-contact-registration-outcome',
  templateUrl: './outcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() campaignId: number;
  @Input() contactId: number;
  @Input() contactTypeCode: number;
  @Input() debtId: number;
  @Input() personId: number;
  @Input() personRole: number;

  nodes: ITreeNode[];

  autoCommentId: number;
  autoCommentOptions: IOption[];
  autoComment: string;
  comment: string;
  template: string;

  private autoCommentIdSubscription: Subscription;
  private commentSubscription: Subscription;
  private selectedNodeSubscription: Subscription;

  constructor(
    private accordionService: AccordionService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private outcomeService: OutcomeService,
    private userTemplatesService: UserTemplatesService,
    private workplacesService: WorkplacesService,
  ) {}

  ngOnInit(): void {
    this.userTemplatesService.getTemplates(4, 0)
      .map(valuesToOptions)
      .subscribe(autoCommentOptions => {
        this.autoCommentOptions = autoCommentOptions;
        this.cdRef.markForCheck();
      });

    this.autoCommentIdSubscription = this.hasAutoComment$
      .filter(invert)
      .subscribe(() => {
        this.autoCommentId = null;
        this.autoComment = null;
        this.cdRef.markForCheck();
      });

    this.commentSubscription = this.hasComment$
      .filter(invert)
      .subscribe(() => {
        this.comment = null;
        this.cdRef.markForCheck();
      });

    this.fetchNodes();
  }

  ngAfterViewInit(): void {
    this.selectedNodeSubscription = this.selectedNode$
      .distinctUntilChanged()
      .flatMap(selectedNode => {
        return selectedNode && isEmpty(selectedNode.children) && this.hasTemplate
          ? this.workplacesService
            .fetchContactScenario(this.debtId, this.contactTypeCode, selectedNode.id)
            .catch(() => of(null))
          : of(null);
      })
      .subscribe(template => {
        this.template = template;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.autoCommentIdSubscription.unsubscribe();
    this.commentSubscription.unsubscribe();
    this.selectedNodeSubscription.unsubscribe();
  }

  get hasTemplate(): boolean {
    return [1, 2].includes(this.contactTypeCode);
  }

  get hasAutoComment$(): Observable<boolean> {
    return this.selectedNode$.map(node => node && node.data.autoCommentIds && isEmpty(node.children));
  }

  get hasComment$(): Observable<boolean> {
    return this.selectedNode$.map(node => node && [2, 3].includes(node.data.commentMode) && isEmpty(node.children));
  }

  get canSubmit$(): Observable<boolean> {
    return this.selectedNode$.map(node => node && isEmpty(node.children));
  }

  get selectedNode$(): BehaviorSubject<ITreeNode> {
    return this.contactRegistrationService.selectedNode$;
  }

  onNodeSelect(event: { node: ITreeNode }): void {
    const { node } = event;
    this.selectedNode$.next(node);
    this.cdRef.markForCheck();
  }

  onNextClick(): void {
    const code = this.contactRegistrationService.selectedNode$.value.data.code;
    const data = this.buildPayload(this.contactTypeCode, this.contactId);
    this.outcomeService.initRegistration(this.debtId, {
      ...data,
      code,
      personId: this.personId,
      personRole: this.personRole,
      campaignId: this.campaignId,
    })
    .subscribe(guid => {
      const { autoComment, autoCommentId, comment } = this;
      this.contactRegistrationService.guid = guid;
      this.contactRegistrationService.autoComment$.next({ autoComment, autoCommentId, comment });
      this.accordionService.next();
      this.cdRef.markForCheck();
    });
  }

  onAutoCommentIdChange(option: IOption[]): void {
    const templateId = Number(option[0].value);
    if (templateId) {
      this.outcomeService
        .fetchAutoComment(this.debtId, this.personId, this.personRole, templateId)
        .catch(() => of(null))
        .subscribe(autoComment => {
          this.autoComment = autoComment;
          this.cdRef.markForCheck();
        });
    }
  }

  private buildPayload(contactTypeCode: number, contactId: number): object {
    if (contactId) {
      switch (contactTypeCode) {
        case 1:
        case 2:
          return { phoneId: contactId };
        case 3:
          return { addressId: contactId };
      }
    }
    return {};
  }

  private fetchNodes(): void {
    this.workplacesService.fetchContactTree(this.debtId, this.contactTypeCode).subscribe(nodes => {
      this.nodes = nodes;
      this.cdRef.markForCheck();
    });
  }
}
