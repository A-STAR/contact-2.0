import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            // { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
        ]
    },

    // Not lazy-loaded routes
    { path: 'login', component: LoginComponent },

    // Not found
    { path: '**', redirectTo: 'LoginComponent' }

];
