import { Component } from '@angular/core';
import { TranslatorService } from '../../../core/translator/translator.service';

@Component({
    selector: 'app-connection-error',
    templateUrl: './connection-error.component.html'
})
export class ConnectionErrorComponent {
    constructor(private translator: TranslatorService) {}
}
