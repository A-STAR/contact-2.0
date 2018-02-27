import { TestBed } from '@angular/core/testing';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { AccessService } from './access.service';

class MockEntityAttributesService {

}

class MockUserConstantsService {

}

class MockUserPermissionsService {

}

describe('AccessService', () => {
  let service: AccessService;

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
  });

  it('should initialize', () => {
    expect(service).toBeDefined();
  });
});
