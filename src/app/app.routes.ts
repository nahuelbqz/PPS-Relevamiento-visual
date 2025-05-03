import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'cosas-lindas',
    loadComponent: () =>
      import('./pages/cosas-lindas/cosas-lindas.page').then(
        (m) => m.CosasLindasPage
      ),
  },
  {
    path: 'cosas-feas',
    loadComponent: () =>
      import('./pages/cosas-feas/cosas-feas.page').then((m) => m.CosasFeasPage),
  },
  {
    path: 'mis-fotos',
    loadComponent: () =>
      import('./pages/mis-fotos/mis-fotos.page').then((m) => m.MisFotosPage),
  },
  {
    path: 'grafico-torta',
    loadComponent: () =>
      import('./pages/grafico-torta/grafico-torta.page').then(
        (m) => m.GraficoTortaPage
      ),
  },
  {
    path: 'grafico-barra',
    loadComponent: () =>
      import('./pages/grafico-barra/grafico-barra.page').then(
        (m) => m.GraficoBarraPage
      ),
  },
];
