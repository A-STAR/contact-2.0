import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SettingsService } from '../../../core/settings/settings.service';
import { AuthService } from '../../../core/auth/auth.service';

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
  ) {
    const login = this.login;
    const remember = !!login;

    this.form = this.fb.group({
      'login': [ login, Validators.compose([ Validators.required, Validators.minLength(2) ]) ],
      'password': [ null, Validators.required ],
      'remember_login': [remember],
    });
  }

  submitForm(event: UIEvent, value: any): void {
    event.preventDefault();

    this.login = value.remember_login ? value.login : null;

    [].forEach.call(this.form.controls, ctrl => {
        ctrl.markAsTouched();
    });

    if (this.form.valid) {
      const { login, password } = value;
      this.authService.dispatchLoginAction(login, password);
    }
  }

  private get login(): string {
    return localStorage.getItem(LoginComponent.LOGIN_KEY);
  }

  private set login(login: string) {
    if (login) {
      localStorage.setItem(LoginComponent.LOGIN_KEY, login);
    } else {
      localStorage.removeItem(LoginComponent.LOGIN_KEY);
    }
  }
}
