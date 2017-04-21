import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { RecoverComponent } from './recover/recover.component';
// import { LockComponent } from './lock/lock.component';
// import { MaintenanceComponent } from './maintenance/maintenance.component';

/* Use this routes definition in case you want to make them lazy-loaded */
const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent },
    // { path: 'recover', component: RecoverComponent },
    // { path: 'lock', component: LockComponent },
    // { path: 'maintenance', component: MaintenanceComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        LoginComponent,
        // RegisterComponent,
        // RecoverComponent,
        // LockComponent,
        // MaintenanceComponent,
    ],
    exports: [
        RouterModule,
        LoginComponent,
        // RegisterComponent,
        // RecoverComponent,
        // LockComponent,
        // MaintenanceComponent,
    ]
})
export class PagesModule { }
