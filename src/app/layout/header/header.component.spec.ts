/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

import { SettingsService } from '../../core/settings/settings.service';
import { AuthService } from '../../core/auth/auth.service';

describe('Component: Header', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SettingsService, AuthService]
        }).compileComponents();
    });

    it('should create an instance', async(inject([SettingsService, AuthService], (settingsService, authService) => {
        const component = new HeaderComponent(settingsService, authService);
        expect(component).toBeTruthy();
    })));
});
