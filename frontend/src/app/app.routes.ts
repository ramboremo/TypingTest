import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { MainPage } from './pages/main-page/main-page';
import { Stats } from './pages/stats/stats'; // 1. Import the new Stats component

export const routes: Routes = [
  // 2. Add the new route for the stats page
  { path: 'stats', component: Stats },
  
  // Existing routes
  { path: 'test', component: MainPage },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  // Default route
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

