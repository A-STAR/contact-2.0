/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ThemesService } from './themes.service';

xdescribe('Service: Themes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemesService]
    });
  });

  it('should ...', inject([ThemesService], (service: ThemesService) => {
    expect(service).toBeTruthy();
  }));
});
