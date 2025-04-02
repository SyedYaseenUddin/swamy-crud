import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent)
    },
    {
        path : '',
        loadComponent: () => import('./components/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
        children: [
            {
                path: 'amount-transfer',
                loadComponent: () => import('./components/transfer-amount/transfer-amount.component').then(c => c.TransferAmountComponent)
            },
            {
                path: 'history',
                loadComponent: () => import('./components/history/history.component').then(c => c.HistoryComponent)
            },
            {
                path: '',
                loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent),
                pathMatch: 'full'
            },
        ]
    }
];
