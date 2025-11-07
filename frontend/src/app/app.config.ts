import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <-- Import this

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // provideHttpClient() makes the HttpClient service available everywhere
  providers: [provideRouter(routes), provideHttpClient()] // <-- Add it here
};
