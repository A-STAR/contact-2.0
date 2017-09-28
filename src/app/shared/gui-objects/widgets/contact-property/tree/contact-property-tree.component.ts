import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-contact-property-tree',
  templateUrl: './contact-property-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeComponent implements OnInit, OnDestroy {
  constructor(
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this.userDictionariesService
      .getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_PAYMENT_STATUS,
        UserDictionariesService.DICTIONARY_CONTACT_TREE_TYPE,
      ])
      .subscribe(console.log);
  }

  ngOnDestroy(): void {

  }
}
