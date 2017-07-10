import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContractor, IPortfolio } from './contractors-and-portfolios.interface';

@Injectable()
export class ContractorsAndPortfoliosService {
  get selectedContractor$(): Observable<IContractor> {
    // TODO(d.maltsev)
    return Observable.of(null);
  }

  get selectedPortfolio$(): Observable<IPortfolio> {
    // TODO(d.maltsev)
    return Observable.of(null);
  }

  fetchContractors(): void {
    // TODO(d.maltsev)
  }

  fetchPortfolios(): void {
    // TODO(d.maltsev)
  }
}
