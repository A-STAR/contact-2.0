import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ILabeledValue } from '@app/shared/components/form/select/select.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-menu-select',
  templateUrl: './menu-select.component.html',
  styleUrls: ['./menu-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSelectComponent implements OnInit, OnDestroy {
  @Input() dictCode: number;
  @Input() lookupKey: ILookupKey;
  @Input() label: string;
  @Input() disabled = false;

  @Output() action = new EventEmitter<ILabeledValue>();

  private optionsSubscription: Subscription;
  options: ILabeledValue[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    if (this.dictCode && this.lookupKey) {
      throw new Error('MenuSelectComponent must have either dictCode or lookupKey but not both.');
    }

    if (this.dictCode) {
      this.optionsSubscription = this.userDictionariesService.getDictionaryAsOptions(this.dictCode)
      .subscribe(options => {
        this.options = options;
        this.cdRef.markForCheck();
      });
    }
    if (this.lookupKey) {
      this.optionsSubscription = this.lookupService.lookupAsOptions(this.lookupKey)
      .subscribe(options => {
        this.options = options;
        this.cdRef.markForCheck();
      });
    }
  }

  get isLeft(): boolean {
    return false;
  }

  onSelect(option: ILabeledValue): void {
    this.action.emit(option);
  }

  getIconCls(): string {
    return this.isLeft ? 'menu-left fa-caret-left' : 'menu-right fa-caret-right';
  }

  ngOnDestroy(): void {
    if (this.optionsSubscription) {
      this.optionsSubscription.unsubscribe();
    }
  }

}
