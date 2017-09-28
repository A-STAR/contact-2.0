import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { IOption } from '../../../../../core/converter/value-converter.interface';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-contact-property-tree',
  templateUrl: './contact-property-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  contactType: number = null;
  contactTypeOptions = [];

  treeType: number = null;
  treeTypeOptions = [];

  ngOnInit(): void {
    this.userDictionariesService
      .getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_PAYMENT_STATUS,
        UserDictionariesService.DICTIONARY_CONTACT_TREE_TYPE,
      ])
      .subscribe(dictionaries => {
        this.initContactTypeSelect(dictionaries);
        this.initTreeTypeSelect(dictionaries);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {

  }

  private initContactTypeSelect(dictionaries: { [key: number]: IOption[] }): void {
    this.contactTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_PAYMENT_STATUS];
    this.contactType = this.contactTypeOptions.length ? this.contactTypeOptions[0].value : null;
  }

  private initTreeTypeSelect(dictionaries: { [key: number]: IOption[] }): void {
    this.treeTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_TREE_TYPE];
    this.treeType = this.treeTypeOptions ? this.treeTypeOptions[0].value : null;
  }
}
