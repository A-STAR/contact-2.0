import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../../core/auth/auth.service';
import { PersistenceService } from '../../../core/persistence/persistence.service';
import { SettingsService } from '../../../core/settings/settings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  static LOGIN_KEY = 'auth/login';

  form: FormGroup;

  constructor(
    public settings: SettingsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private persistenceService: PersistenceService,
  ) {
    const login = this.login;
    const remember = !!login;

    this.form = this.fb.group({
      login: [ login, Validators.compose([ Validators.required, Validators.minLength(2) ]) ],
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
