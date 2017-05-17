import { Component } from '@angular/core';
import { TranslatorService } from '../../../core/translator/translator.service';

@Component({
    selector: 'app-connection-error',
    templateUrl: './connection-error.component.html',
    styleUrls: ['./connection-error.component.scss']
})
export class ConnectionErrorComponent {
    constructor(private translator: TranslatorService) {}
}
