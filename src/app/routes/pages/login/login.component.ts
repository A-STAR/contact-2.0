import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    private translateService: TranslateService,
    private router: Router,
  ) {
    const login = this.login;
    const remember = !!login;

    this.form = fb.group({
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
      this.authService
        .authenticate(login, password)
        .subscribe(
          success => {
            const redirectUrl = this.authService.redirectUrl || '/home';
            this.router.navigate([redirectUrl]);
          }
        );
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
