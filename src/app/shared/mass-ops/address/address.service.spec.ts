import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { AddressService } from './address.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';


class MockActionGridService {
  buildRequest(): any {
    return {};
  }
}

class MockDataService {
  create(): Observable<any> {
    return of([]);
  }
}

class MockNotificationsService {
  fetchError(): any {
    return {};
  }
}

describe('AddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressService,
        {
          provide: ActionGridService,
          useClass: MockActionGridService,
        },
        {
          provide: DataService,
          useClass: MockDataService,
        },
        {
          provide: NotificationsService,
          useClass: MockNotificationsService,
        }
      ]
    });
  });

  it('should be created', inject([AddressService], (service: AddressService) => {
    expect(service).toBeTruthy();
  }));
});
