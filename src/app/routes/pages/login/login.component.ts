import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { IMetadataFormConfig, IMetadataFormControlType } from '@app/shared/components/form/metadata-form/metadata-form.interface';

import { AuthService } from '../../../core/auth/auth.service';
import { PersistenceService } from '../../../core/persistence/persistence.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  styleUrls: [ './login.component.scss' ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private static LOGIN_KEY = 'auth/login';

  @ViewChild(MetadataFormComponent) form: MetadataFormComponent<any>;

  readonly config: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        disabled: false,
        display: true,
        label: 'login.login_placeholder',
        name: 'login',
        type: IMetadataFormControlType.TEXT,
        validators: { required: true, minLength: 2 },
      },
      {
        disabled: false,
        display: true,
        label: 'login.password_placeholder',
        name: 'password',
        type: IMetadataFormControlType.PASSWORD,
        validators: { required: true },
      },
      {
        disabled: false,
        display: true,
        label: 'login.remember_me',
        name: 'remember_login',
        type: IMetadataFormControlType.CHECKBOX,
        validators: {},
      },
    ],
  };

  readonly data = {
    login: this.login,
  };

  constructor(
    public settings: SettingsService,
    private authService: AuthService,
    private persistenceService: PersistenceService,
  ) {}

  get canSubmit(): boolean {
    const { formGroup } = this.form;
    return formGroup.valid && formGroup.dirty;
  }

  onSubmitClick(): void {
    const { value } = this.form.formGroup;
    this.login = value.remember_login ? value.login : null;
    const { login, password } = value;
    this.authService.dispatchLoginAction(login, password);
  }

  private get login(): string {
    return this.persistenceService.get(LoginComponent.LOGIN_KEY);
  }

  private set login(login: string) {
    if (login) {
      this.persistenceService.set(LoginComponent.LOGIN_KEY, login);
    } else {
      this.persistenceService.remove(LoginComponent.LOGIN_KEY);
    }
  }
}
