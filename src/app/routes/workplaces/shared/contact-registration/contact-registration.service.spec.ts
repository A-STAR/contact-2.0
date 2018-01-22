import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { random } from 'faker';

import { IContactRegistrationMode, IOutcome } from './contact-registration.interface';

import { ContactRegistrationService } from './contact-registration.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

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

class MockNotificationService {
  error(): any {
    return {
      dispatchCallback: () => {
        return () => ErrorObservable.create({});
      }
    };
  }
}

describe('ContactRegistrationService', () => {
  let service: ContactRegistrationService;

  beforeEach(() => {
    service = new ContactRegistrationService(
      new MockDataService() as any,
      new MockNotificationService() as any,
    );
  });

  it('should initialize', () => {
    expect(service).toBeTruthy();
  });

  it('should get/set campaignId', () => {
    const campaignId = random.number();
    service.campaignId = campaignId;
    expect(service.campaignId).toEqual(campaignId);
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

  it('should get/set contactId', () => {
    const contactId = random.number();
    service.contactId = contactId;
    expect(service.contactId).toEqual(contactId);
    service.contactId$.pipe(first()).subscribe(id => expect(id).toEqual(contactId));
  });

  it('should get/set contactType', () => {
    const contactType = random.number();
    service.contactType = contactType;
    expect(service.contactType).toEqual(contactType);
    service.contactType$.pipe(first()).subscribe(type => expect(type).toEqual(contactType));
  });

  it('should get/set debtId', () => {
    const debtId = random.number();
    service.debtId = debtId;
    expect(service.debtId).toEqual(debtId);
    service.debtId$.pipe(first()).subscribe(id => expect(id).toEqual(debtId));
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

  it('should get/set personId', () => {
    const personId = random.number();
    service.personId = personId;
    expect(service.personId).toEqual(personId);
    service.personId$.pipe(first()).subscribe(id => expect(id).toEqual(personId));
  });

  it('should get/set personRole', () => {
    const personRole = random.number();
    service.personRole = personRole;
    expect(service.personRole).toEqual(personRole);
    service.personRole$.pipe(first()).subscribe(role => expect(role).toEqual(personRole));
  });
});
