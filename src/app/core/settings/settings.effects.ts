import { Injectable } from '@angular/core';
import { UnsafeAction } from '../../core/state/state.interface';
import { Actions, Effect } from '@ngrx/effects';

import { AuthService } from '@app/core/auth/auth.service';
import { SettingsService } from '@app/core/settings/settings.service';

@Injectable()
export class SettingsEffects {

  @Effect({ dispatch: false })
  createSession$ = this.actions
    .ofType(AuthService.AUTH_CREATE_SESSION)
    .filter(({ payload }: UnsafeAction) => payload.redirectAfterLogin !== false)
    .map(() => this.settingsService.redirectAfterLogin());

  @Effect({ dispatch: false })
  destroySession$ = this.actions
    .ofType(AuthService.AUTH_DESTROY_SESSION)
    .filter(({ payload }: UnsafeAction) => !payload || payload.redirectToLogin !== false)
    .map((action: UnsafeAction) => this.settingsService.redirectToLogin(action.payload ? action.payload.url : null));

  constructor(
    private actions: Actions,
    private settingsService: SettingsService,
  ) {}
}
