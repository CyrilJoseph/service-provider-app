import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { AppIdGuard } from './guards/appid.guard';
import { EditServiceProviderComponent } from './service-provider/edit/edit-service-provider.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '404', component: NotFoundComponent },
    {
        path: ':appId',
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'usersettings', component: UserSettingsComponent },
            { path: 'service-provider/:id', component: EditServiceProviderComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ],
        canActivate: [AuthGuard, AppIdGuard]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' }
];
