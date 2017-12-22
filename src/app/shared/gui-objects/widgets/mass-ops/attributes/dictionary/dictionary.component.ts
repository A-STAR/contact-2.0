import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-mass-attr-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictionaryComponent implements OnInit {

  @Input() dictNameCode: number;
  rows: any[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService
  ) { }

  ngOnInit(): void {
    this.userDictionariesService.getDictionary(this.dictNameCode)
      .subscribe(terms => {
        this.rows = terms;
        this.cdRef.markForCheck();
      });
  }

}
