import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContactPropertyService } from '../contact-property.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-contact-property-tree',
  templateUrl: './contact-property-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeComponent implements OnInit {
  constructor(
    private cdRef: ChangeDetectorRef,
    private contactPropertyService: ContactPropertyService,
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
        this.fetch();
      });
  }

  onContactTypeChange(selection: IOption[]): void {
    this.contactType = Number(selection[0].value);
    this.fetch();
  }

  onTreeTypeChange(selection: IOption[]): void {
    this.treeType = Number(selection[0].value);
    this.fetch();
  }

  private initContactTypeSelect(dictionaries: { [key: number]: IOption[] }): void {
    this.contactTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_PAYMENT_STATUS];
    this.contactType = this.contactTypeOptions.length ? this.contactTypeOptions[0].value : null;
  }

  private initTreeTypeSelect(dictionaries: { [key: number]: IOption[] }): void {
    this.treeTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_TREE_TYPE];
    this.treeType = this.treeTypeOptions ? this.treeTypeOptions[0].value : null;
  }

  private fetch(): void {
    this.contactPropertyService.fetchAll(this.contactType, this.treeType).subscribe(() => {
      this.cdRef.markForCheck();
    });
  }
}
