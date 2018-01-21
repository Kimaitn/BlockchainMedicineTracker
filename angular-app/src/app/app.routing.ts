import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home.component';
import {LoginComponent} from './login.component';
import {TrackComponent} from './track.component';

const appRoutes: Routes = [
    {
        path:'',
        component: HomeComponent
    },
	{
        path:'login',
        component: LoginComponent
    },
	{
        path:'track',
        component: TrackComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);