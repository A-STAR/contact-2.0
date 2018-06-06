import { ChangeDetectionStrategy, Component, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import {
  IDynamicLayoutConfig, DynamicLayoutControlType, DynamicLayoutItemType
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-letter-generation-result',
  templateUrl: './result-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterGenerationResultComponent implements OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Output() close = new EventEmitter<ICloseAction>();

  config: IDynamicLayoutConfig = {
    key: 'mass/letter/result',
    items: [
      {
        type: DynamicLayoutItemType.CONTROL,
        controlType: DynamicLayoutControlType.SELECT,
        label: 'widgets.mass.letter.dialog.resultType',
        name: 'resultType',
        options: [
          {
            label: this.translateService.instant('widgets.mass.letter.dialog.fileWithLetters'),
            value: 1
          },
          {
            label: this.translateService.instant('widgets.mass.letter.dialog.register'),
            value: 2
          }
        ]
      }
    ]
  };

  constructor(
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  get canSubmit(): boolean {
    return false;
  }

  onSubmit(): void {
  }

  onClose(): void {
    this.close.emit();
  }
}
