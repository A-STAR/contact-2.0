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

  /*
   * EntityAttributesService
   */

  it('should process type = entity, method = isMandatory, result = true', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isMandatory: true,
        isUsed: null,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.ENTITY,
        method: IAccessByEntityMethod.IS_MANDATORY,
        value: null,
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = entity, method = isMandatory, result = false', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isMandatory: false,
        isUsed: null,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.ENTITY,
        method: IAccessByEntityMethod.IS_MANDATORY,
        value: null,
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = entity, method = isUsed, result = true', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isMandatory: null,
        isUsed: true,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.ENTITY,
        method: IAccessByEntityMethod.IS_USED,
        value: null,
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = entity, method = isUsed, result = false', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isMandatory: null,
        isUsed: false,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.ENTITY,
        method: IAccessByEntityMethod.IS_USED,
        value: null,
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should fail on unknown method (type = entity)', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isMandatory: null,
        isUsed: null,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.ENTITY,
        method: null,
        value: null,
      })
      .subscribe(
        res => {
          expect(res).toBeFalsy();
        },
        error => {
          expect(error).toBeTruthy();
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        }
      );
  });

  /*
   * UserConstantsService
   */

  it('should process type = constant, method = has, result = true', done => {
    const name = 'constant';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: true,
          valueN: null,
          valueS: null,
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.HAS,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = has, result = false', done => {
    const name = 'constant';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: false,
          valueN: null,
          valueS: null,
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.HAS,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = notEmpty, result = true', done => {
    const name = 'constant';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: 'value',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.NOT_EMPTY,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = notEmpty, result = false', done => {
    const name = 'constant';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: '',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.NOT_EMPTY,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = contains, result = true (value = ALL)', done => {
    const name = 'constant';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: 'ALL',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.CONTAINS,
        value: [name, 1],
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = contains, result = true (value = 1,2,3)', done => {
    const name = 'constant';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: '1,2,3',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.CONTAINS,
        value: [name, 1],
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = contains, result = false', done => {
    const name = 'constant';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: '1,2,3',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: IAccessByValueBagMethod.CONTAINS,
        value: [name, 4],
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should fail on unknowm method (type = constant)', done => {
    const name = 'constant';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: null,
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.CONSTANT,
        method: null,
        value: null,
      })
      .subscribe(
        res => {
          expect(res).toBeFalsy();
        },
        error => {
          expect(error).toBeTruthy();
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        },
      );
  });

  /*
   * UserPermissionsService
   */

  it('should process type = permission, method = has, result = true', done => {
    const name = 'permission';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: true,
          valueN: null,
          valueS: null,
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.HAS,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = has, result = false', done => {
    const name = 'permission';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: false,
          valueN: null,
          valueS: null,
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.HAS,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = notEmpty, result = true', done => {
    const name = 'permission';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: 'value',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.NOT_EMPTY,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = notEmpty, result = false', done => {
    const name = 'permission';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: '',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.NOT_EMPTY,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = contains, result = true (value = ALL)', done => {
    const name = 'permission';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: 'ALL',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.CONTAINS,
        value: [name, 1],
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = contains, result = true (value = 1,2,3)', done => {
    const name = 'permission';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: '1,2,3',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.CONTAINS,
        value: [name, 1],
      })
      .subscribe(res => {
        expect(res).toBeTruthy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = contains, result = false', done => {
    const name = 'permission';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: '1,2,3',
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: IAccessByValueBagMethod.CONTAINS,
        value: [name, 4],
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should fail on unknowm method (type = permission)', done => {
    const name = 'permission';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS: null,
        }
      })));
    service
      .hasAccess({
        type: IAccessConfigItemType.PERMISSION,
        method: null,
        value: null,
      })
      .subscribe(
        res => {
          expect(res).toBeFalsy();
        },
        error => {
          expect(error).toBeTruthy();
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        },
      );
  });

  /*
   * Groups
   */

  it('should process type = group, operator = and, result = true', done => {
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

  it('should process type = group, operator = and, result = false', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isUsed: true,
        isMandatory: false,
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
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(2);
        done();
      });
  });

  it('should process type = group, operator = or, result = true', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isUsed: true,
        isMandatory: false,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.GROUP,
        operator: IAccessConfigOperator.OR,
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

  it('should process type = group, operator = or, result = false', done => {
    const spy = spyOn(entityAttributesService, 'getAttribute')
      .and
      .returnValue(of({
        isUsed: false,
        isMandatory: false,
      }));
    service
      .hasAccess({
        type: IAccessConfigItemType.GROUP,
        operator: IAccessConfigOperator.OR,
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
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(2);
        done();
      });
  });

  it('should fail on unknown operator (type = group)', done => {
    service
      .hasAccess({
        type: IAccessConfigItemType.GROUP,
        operator: null,
        children: [],
      })
      .subscribe(
        res => {
          expect(res).toBeFalsy();
        },
        error => {
          expect(error).toBeTruthy();
          done();
        },
      );
  });
});
