import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    MatSnackBarModule
  ]
}).catch(err => console.error(err));
