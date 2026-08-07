import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent) },
  { path: 'events', loadComponent: () => import('./pages/events/events').then(m => m.EventsComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },
  { path: 'connect-group', loadComponent: () => import('./pages/connect-group/connect-group').then(m => m.ConnectGroupComponent) },
  { path: 'volunteer', loadComponent: () => import('./pages/volunteer/volunteer').then(m => m.VolunteerComponent) },
  { path: '**', redirectTo: '' },
];
