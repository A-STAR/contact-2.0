import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { IPortfolio } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('portfolios.grid');

@Component({
  selector: 'app-portfolio-send',
  templateUrl: './portfolio-send.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioSendComponent implements OnInit {
  @Input() portfolio: IPortfolio;
  @Input() isReturn = false;
  @Output() onSubmit = new EventEmitter<IPortfolio>();
  @Output() onCancel = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IPortfolio = null;

  constructor(private cdRef: ChangeDetectorRef, private valueConverterService: ValueConverterService) { }

  ngOnInit(): void {
    this.formData = this.portfolio
    ? {
      ...this.portfolio,
      signDate: this.valueConverterService.fromISO(this.portfolio.signDate as string),
      startWorkDate: this.valueConverterService.fromISO(this.portfolio.startWorkDate as string),
      endWorkDate: this.valueConverterService.fromISO(this.portfolio.endWorkDate as string),
    }
    : null;

    this.controls = this.isReturn ? [
      { label: label('signDate'), controlName: 'signDate', type: 'datepicker' },
    ] : [
        { label: label('signDate'), controlName: 'signDate', type: 'datepicker' },
        { label: label('startWorkDate'), controlName: 'startWorkDate', type: 'datepicker' },
        { label: label('endWorkDate'), controlName: 'endWorkDate', type: 'datepicker' },
      ];

  this.cdRef.markForCheck();

  }

  canSubmit(): boolean {
    return this.form && this.form.isValid;
  }

  submit(): void {
    const portfolio = this.form.serializedUpdates;
    this.onSubmit.emit({ ...portfolio, directionCode: this.portfolio.directionCode });
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get title(): string {
    return this.isReturn ? 'portfolios.outsourcing.return.title' : 'portfolios.outsourcing.send.title';
  }

}
