import { ChangeDetectionStrategy, Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import {
  IDynamicLayoutConfig,
  DynamicLayoutItemType,
  DynamicLayoutGroupType,
  DynamicLayoutGroupMode,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-incoming-call-layout',
  templateUrl: 'incoming-call-layout.component.html',
})
export class IncomingCallLayoutComponent implements OnInit {

  @ViewChild('incomingCallTitlebar', { read: TemplateRef }) titlebar: TemplateRef<any>;
  @ViewChild('incomingCallFilter', { read: TemplateRef }) filter:     TemplateRef<any>;
  @ViewChild('incomingCallDebtorGrid', { read: TemplateRef }) debtorGrid: TemplateRef<any>;
  @ViewChild('incomingCallPhoneGrid', { read: TemplateRef }) phoneGrid: TemplateRef<any>;
  @ViewChild('incomingCallDebtorCard', { read: TemplateRef }) debtorCard: TemplateRef<any>;

  templates: Record<string, TemplateRef<any>>;

  readonly layout: IDynamicLayoutConfig = {
    key: 'workplaces/incoming-call',
    items: [
      {
        type: DynamicLayoutItemType.GROUP,
        groupType: DynamicLayoutGroupType.VERTICAL,
        size: 100,
        children: [
          {
            type: DynamicLayoutItemType.TEMPLATE,
            value: 'incomingCallTitlebar',
          },
          {
            type: DynamicLayoutItemType.GROUP,
            groupType: DynamicLayoutGroupType.VERTICAL,
            mode: DynamicLayoutGroupMode.SPLITTERS,
            size: 100,
            children: [
              {
                type: DynamicLayoutItemType.GROUP,
                groupType: DynamicLayoutGroupType.HORIZONTAL,
                mode: DynamicLayoutGroupMode.SPLITTERS,
                size: 70,
                children: [
                  {
                    type: DynamicLayoutItemType.TEMPLATE,
                    value: 'incomingCallFilter',
                    size: 15
                  },
                  {
                    type: DynamicLayoutItemType.TEMPLATE,
                    value: 'incomingCallDebtorGrid',
                    size: 85
                  }
                ],
              },
              {
                type: DynamicLayoutItemType.GROUP,
                groupType: DynamicLayoutGroupType.VERTICAL,
                mode: DynamicLayoutGroupMode.SPLITTERS,
                size: 30,
                children: [
                  {
                    type: DynamicLayoutItemType.TEMPLATE,
                    value: 'incomingCallPhoneGrid',
                    size: 35
                  },
                  {
                    type: DynamicLayoutItemType.TEMPLATE,
                    value: 'incomingCallDebtorCard',
                    size: 65
                  },
                ]
              }
            ]
          },
        ],
      },
    ],
  };

  ngOnInit(): void {
    this.templates = {
      incomingCallTitlebar: this.titlebar,
      incomingCallFilter: this.filter,
      incomingCallDebtorGrid: this.debtorGrid,
      incomingCallPhoneGrid: this.phoneGrid,
      incomingCallDebtorCard: this.debtorCard
    };
  }
}
