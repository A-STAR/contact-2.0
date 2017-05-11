import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { SettingsService } from '../../../core/settings/settings.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TranslatorService } from '../../../core/translator/translator.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    valForm: FormGroup;

    error: string = null;

    constructor(
        public settings: SettingsService,
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private translator: TranslatorService,
    ) {
        this.valForm = fb.group({
            'login': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
            'password': [null, Validators.required]
        });

        this.valForm.valueChanges.subscribe(() => this.error = null);
    }

    submitForm(event, value: any) {
        this.error = null;

        event.preventDefault();
        [].forEach.call(this.valForm.controls, ctrl => {
            ctrl.markAsTouched();
        });

        if (this.valForm.valid) {
            const { login, password } = value;
            this.authService
                .authenticate(login, password)
                .then(success => {
                    const redirectUrl = this.authService.redirectUrl || '/home';
                    this.router.navigate([redirectUrl]);
                })
                .catch(error => this.error = error.message);
        }
    }
}
