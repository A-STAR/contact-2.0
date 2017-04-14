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
            { path: 'workflow', loadChildren: './tree/flow.module#FlowModule' },
            { path: 'grid', loadChildren: './tables/tables.module#TablesModule' },
        ]
    },

    // Eagerly-loaded routes
    { path: 'login', component: LoginComponent },

    // Not found
    { path: '**', redirectTo: 'LoginComponent' }

];
