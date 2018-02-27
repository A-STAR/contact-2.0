import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { IAccessConfigItemType, IAccessByEntityMethod, IAccessByValueBagMethod, IAccessConfigOperator } from './access.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ValueBag } from '@app/core/value-bag/value-bag';

import { AccessService } from './access.service';

class MockEntityAttributesService {
  getAttribute(id: number): any {}
}

class MockUserConstantsService {
  bag(): any {}
}

class MockUserPermissionsService {
  bag(): any {}
}

describe('AccessService', () => {
  let service: AccessService;
  let entityAttributesService: EntityAttributesService;
  let userConstantsService: UserConstantsService;
  let userPermissionsService: UserPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccessService,
        {
          provide: EntityAttributesService,
          useClass: MockEntityAttributesService,
        },
        {
          provide: UserConstantsService,
          useClass: MockUserConstantsService,
        },
        {
          provide: UserPermissionsService,
          useClass: MockUserPermissionsService,
        },
      ],
    });
    service = TestBed.get(AccessService);
    entityAttributesService = TestBed.get(EntityAttributesService);
    userConstantsService = TestBed.get(UserConstantsService);
    userPermissionsService = TestBed.get(UserPermissionsService);
  });

  it('should initialize', () => {
    expect(service).toBeDefined();
  });

  it('should process type = entity, method = isMandatory', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isUsed: true,
        isMandatory: true,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.ENTITY,
        method: IAccessByEntityMethod.IS_MANDATORY,
        value: 1,
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = entity, method = isUsed', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isUsed: true,
        isMandatory: true,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.ENTITY,
        method: IAccessByEntityMethod.IS_USED,
        value: 1,
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = has', done => {
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        constant: {
          name: 'constant',
          valueB: true,
          valueN: null,
          valueS: null,
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.HAS,
        value: 'constant',
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = notEmpty', done => {
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        constant: {
          name: 'constant',
          valueB: null,
          valueN: null,
          valueS: 'value',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.NOT_EMPTY,
        value: 'constant',
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = contains', done => {
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        constant: {
          name: 'constant',
          valueB: null,
          valueN: null,
          valueS: '1,2,3',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.CONTAINS,
        value: ['constant', 1],
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = has', done => {
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        permission: {
          name: 'permission',
          valueB: true,
          valueN: null,
          valueS: null,
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.HAS,
        value: 'permission',
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = notEmpty', done => {
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        permission: {
          name: 'permission',
          valueB: null,
          valueN: null,
          valueS: 'value',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.NOT_EMPTY,
        value: 'permission',
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = contains', done => {
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        permission: {
          name: 'permission',
          valueB: null,
          valueN: null,
          valueS: '1,2,3',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.CONTAINS,
        value: ['permission', 1],
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = group', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isUsed: true,
        isMandatory: true,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.GROUP,
        operator: IAccessConfigOperator.AND,
        children: [
          {
            type: IAccessConfigItemType.ENTITY,
            method: IAccessByEntityMethod.IS_MANDATORY,
            value: 1,
          },
          {
            type: IAccessConfigItemType.ENTITY,
            method: IAccessByEntityMethod.IS_USED,
            value: 1,
          }
        ],
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(2);
        done();
      });
  });
});
