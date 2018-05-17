import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@app/core/auth/auth.service';
import { PersistenceService } from '@app/core/persistence/persistence.service';
import { SettingsService } from '@app/core/settings/settings.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  styleUrls: [ './login.component.scss' ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private static LOGIN_KEY = 'auth/login';

  form: FormGroup;

  constructor(
    public settings: SettingsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private persistenceService: PersistenceService,
  ) {
    const login = this.login;
    const remember = !!login;

    this.form = this.formBuilder.group({
      login: [ login, Validators.required ],
      password: [ null, Validators.required ],
      remember_login: [ remember ],
    });
  }

  isControlDirtyOrTouched(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (control.dirty || control.touched);
  }

  submitForm(event: UIEvent, value: any): void {
    event.preventDefault();

    this.login = value.remember_login ? value.login : null;

    this.form.markAsTouched();

    if (this.form.valid) {
      const { login, password } = value;
      this.authService.dispatchLoginAction(login, password);
    }
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
