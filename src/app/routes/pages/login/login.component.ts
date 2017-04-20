import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { SettingsService } from '../../../core/settings/settings.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    valForm: FormGroup;

    constructor(
      public settings: SettingsService,
      private authService: AuthService,
      fb: FormBuilder,
      private router: Router,
    ) {

      this.valForm = fb.group({
        'login': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
        'password': [null, Validators.required]
      });

    }

    submitForm(event, value: any) {
      event.preventDefault();
      [].forEach.call(this.valForm.controls, ctrl => {
        ctrl.markAsTouched();
      });

      if (this.valForm.valid) {
        const { login, password } = value;
        this.authService
          .authenticate(login, password)
          .then(success => {
            this.router.navigate(['/home']);
          });
      }
    }

    ngOnInit() {

    }

}
