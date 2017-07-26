import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
  styleUrls: [ './debt-processing.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtProcessingComponent {
  static COMPONENT_NAME = 'DebtProcessingComponent';

  page$ = Observable.of(1);
  pageSize$ = Observable.of(100);
  rows$ = Observable.of([{ debtId: 1 }]);
  rowCount$ = this.rows$.map(rows => rows.length);
  selected$ = Observable.of([]);

  onRequestData(event: any): void {
    console.log('onRequestData');
  }

  onFilter(event: any): void {
    console.log('onFilter');
  }

  onSelect(event: any): void {
    console.log('onSelect');
  }
}
