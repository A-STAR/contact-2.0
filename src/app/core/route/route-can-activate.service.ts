import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { AuthService } from '../auth/auth.service';
import { UserPermissionsService } from '../user/permissions/user-permissions.service';
import { TranslatorService } from '../translator/translator.service';

@Injectable()
export class RouteCanActivateService implements CanActivate {

  constructor(private authService: AuthService,
              private translatorService: TranslatorService,
              private userPermissionsService: UserPermissionsService) {
  }

  /**
   * override
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.create(observer => {
      Observable.forkJoin<boolean>(
        Observable.create((authObserver) => {
          authObserver.next(this.authService.canActivate(route, state));
          authObserver.complete();
        }),
        this.translatorService.useLanguage(),
        this.userPermissionsService.loadUserPermissions()
      ).subscribe((result: boolean[]) => {
        observer.next(result.reduce((previousResult: boolean, currentResult: boolean) => previousResult && currentResult));
        observer.complete();
      });
    });
  }
}
