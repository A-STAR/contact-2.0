import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ConnectionErrorComponent } from './connection-error/connection-error.component';

/* Use this routes definition in case you want to make them lazy-loaded */
const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'connection-error', component: ConnectionErrorComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        LoginComponent,
        ConnectionErrorComponent,
    ],
    exports: [
        RouterModule,
        LoginComponent,
        ConnectionErrorComponent,
    ]
})
export class PagesModule { }
