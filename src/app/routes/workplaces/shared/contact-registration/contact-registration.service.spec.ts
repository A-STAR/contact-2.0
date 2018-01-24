import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { random } from 'faker';

import { IContactRegistrationMode, IOutcome, IContactRegistrationParams } from './contact-registration.interface';

import { ContactRegistrationService } from './contact-registration.service';
import { IPromiseLimit } from '@app/routes/workplaces/core/promise/promise.interface';
import { IDebt } from '@app/routes/workplaces/core/debts/debts.interface';

class MockDataService {
  create(): Observable<any> {
    return of({
      data: [
        {
          guid: random.uuid(),
        },
      ],
    });
  }
}

class MockDebtsService {
  getDebt(debtId: number): Observable<IDebt> {
    return of(null);
  }
}

class MockNotificationService {
  error(): any {
    return {
      dispatchCallback: () => {
        return () => ErrorObservable.create({});
      }
    };
  }
}

class MockPromiseService {
  getLimit(): Observable<IPromiseLimit> {
    return of(null);
  }
}

describe('ContactRegistrationService', () => {
  let service: ContactRegistrationService;

  beforeEach(() => {
    service = new ContactRegistrationService(
      new MockDataService() as any,
      new MockDebtsService() as any,
      new MockNotificationService() as any,
      new MockPromiseService() as any,
    );
  });

  it('should initialize', () => {
    expect(service).toBeTruthy();
  });

  it('should get/set params', () => {
    const params: IContactRegistrationParams = {
      campaignId: random.number(),
      contactId: random.number(),
      contactType: random.number(),
      debtId: random.number(),
      personId: random.number(),
      personRole: random.number(),
    };
    service.params = params;
    expect(service.params).toEqual(params);
    service.params$.pipe(first()).subscribe(p => expect(p).toEqual(params));
  });

  it('should get/set guid', () => {
    const guid = random.uuid();
    service.guid = guid;
    expect(service.guid).toEqual(guid);
  });

  it('should get/set edit mode', () => {
    service.mode = IContactRegistrationMode.EDIT;
    expect(service.mode).toEqual(IContactRegistrationMode.EDIT);
  });

  it('should get/set tree mode', () => {
    service.mode = IContactRegistrationMode.TREE;
    expect(service.mode).toEqual(IContactRegistrationMode.TREE);
  });

  it('should get/set outcome', () => {
    const outcome: IOutcome = {
      addPhone: random.number(),
      autoCommentIds: random.word(),
      boxColor: random.word(),
      callReasonMode: random.number(),
      changeContactPerson: random.number(),
      changeResponsible: random.number(),
      code: random.number(),
      commentMode: random.number(),
      contactInvisible: random.number(),
      debtReasonMode: random.number(),
      debtStatusCode: random.number(),
      dictValue1: random.number(),
      dictValue2: random.number(),
      dictValue3: random.number(),
      dictValue4: random.number(),
      fileAttachMode: random.number(),
      id: random.number(),
      isInvalidContact: random.number(),
      isRefusal: random.number(),
      isSuccess: random.number(),
      name: random.word(),
      nextCallDays: random.number(),
      nextCallFormula: random.number(),
      nextCallMode: random.number(),
      paymentMode: random.number(),
      promiseMode: random.number(),
      regInvisible: random.number(),
      sortOrder: random.number(),
      statusReasonMode: random.number(),
      templateFormula: random.number(),
      templateId: random.number(),
    };
    service.outcome = outcome;
    expect(service.outcome).toEqual(outcome);
    service.outcome$.pipe(first()).subscribe(o => expect(o).toEqual(outcome));
  });
});
