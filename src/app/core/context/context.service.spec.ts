import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {
  IContextConfigItemType,
  IContextByEntityMethod,
  IContextByValueBagMethod,
  IContextConfigOperator,
} from './context.interface';
import { IEntityAttribute } from '@app/core/entity/attributes/entity-attributes.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ValueBag } from '@app/core/value-bag/value-bag';

import { ContextService } from './context.service';

declare var spyOn: any;

class MockEntityAttributesService {
  getAttribute(): Observable<IEntityAttribute> {
    return null;
  }
}

class MockUserConstantsService {
  bag(): Observable<ValueBag> {
    return null;
  }
}

class MockUserPermissionsService {
  bag(): Observable<ValueBag> {
    return null;
  }
}

describe('ContextService', () => {
  let service: ContextService;
  let entityAttributesService: EntityAttributesService;
  let userConstantsService: UserConstantsService;
  let userPermissionsService: UserPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContextService,
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
    service = TestBed.get(ContextService);
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
      .calculate({
        type: IContextConfigItemType.ENTITY,
        method: IContextByEntityMethod.IS_MANDATORY,
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
      .calculate({
        type: IContextConfigItemType.ENTITY,
        method: IContextByEntityMethod.IS_MANDATORY,
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
      .calculate({
        type: IContextConfigItemType.ENTITY,
        method: IContextByEntityMethod.IS_USED,
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
      .calculate({
        type: IContextConfigItemType.ENTITY,
        method: IContextByEntityMethod.IS_USED,
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
      .calculate({
        type: IContextConfigItemType.ENTITY,
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
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.HAS,
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
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.HAS,
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
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.NOT_EMPTY,
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
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.NOT_EMPTY,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = value (valueN)', done => {
    const name = 'constant';
    const valueN = 42;
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN,
          valueS: '',
        }
      })));
    service
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.VALUE,
        value: name,
      })
      .subscribe(res => {
        expect(res).toEqual(valueN);
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = constant, method = value (valueS)', done => {
    const name = 'constant';
    const valueS = 'Foo';
    const spy = spyOn(userConstantsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS,
        }
      })));
    service
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.VALUE,
        value: name,
      })
      .subscribe(res => {
        expect(res).toEqual(valueS);
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
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.CONTAINS,
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
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.CONTAINS,
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
      .calculate({
        type: IContextConfigItemType.CONSTANT,
        method: IContextByValueBagMethod.CONTAINS,
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
      .calculate({
        type: IContextConfigItemType.CONSTANT,
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
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.HAS,
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
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.HAS,
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
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.NOT_EMPTY,
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
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.NOT_EMPTY,
        value: name,
      })
      .subscribe(res => {
        expect(res).toBeFalsy();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = value (valueN)', done => {
    const name = 'permission';
    const valueN = 42;
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN,
          valueS: '',
        }
      })));
    service
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.VALUE,
        value: name,
      })
      .subscribe(res => {
        expect(res).toEqual(valueN);
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should process type = permission, method = value (valueS)', done => {
    const name = 'permission';
    const valueS = 'Foo';
    const spy = spyOn(userPermissionsService, 'bag')
      .and
      .returnValue(of(new ValueBag({
        [name]: {
          name,
          valueB: null,
          valueN: null,
          valueS,
        }
      })));
    service
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.VALUE,
        value: name,
      })
      .subscribe(res => {
        expect(res).toEqual(valueS);
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
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.CONTAINS,
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
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.CONTAINS,
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
      .calculate({
        type: IContextConfigItemType.PERMISSION,
        method: IContextByValueBagMethod.CONTAINS,
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
      .calculate({
        type: IContextConfigItemType.PERMISSION,
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
      .calculate({
        type: IContextConfigItemType.GROUP,
        operator: IContextConfigOperator.AND,
        children: [
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_MANDATORY,
            value: 1,
          },
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_USED,
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
      .calculate({
        type: IContextConfigItemType.GROUP,
        operator: IContextConfigOperator.AND,
        children: [
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_MANDATORY,
            value: 1,
          },
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_USED,
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
      .calculate({
        type: IContextConfigItemType.GROUP,
        operator: IContextConfigOperator.OR,
        children: [
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_MANDATORY,
            value: 1,
          },
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_USED,
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
      .calculate({
        type: IContextConfigItemType.GROUP,
        operator: IContextConfigOperator.OR,
        children: [
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_MANDATORY,
            value: 1,
          },
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_USED,
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
      .calculate({
        type: IContextConfigItemType.GROUP,
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
