import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    //  { path: 'usersettings', component: UserSettingsComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    //   { path: 'service-provider/:id', component: EditServiceProviderComponent, canActivate: [AuthGuard] },
    //  { path: 'add-service-provider', component: AddServiceProviderComponent, canActivate: [AuthGuard] },
    { path: '404', component: NotFoundComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' }
];
