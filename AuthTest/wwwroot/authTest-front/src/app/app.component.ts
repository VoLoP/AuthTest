import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './auth.interceptor';
import { bootstrapApplication } from '@angular/platform-browser';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

const jwtConfig: JwtModuleOptions = {
  config: {
    tokenGetter: tokenGetter,
    allowedDomains: ['localhost:5001'],
    disallowedRoutes: ['localhost:5001/api/auth']
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
     BrowserModule,
    HttpClientModule],
    providers: [
      provideHttpClient(),
      JwtModule.forRoot(jwtConfig),
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'authTest-front';

  constructor(private http: HttpClient) {}

  
}

bootstrapApplication(AppComponent);