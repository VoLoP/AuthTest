import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api-url/api/auth';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password, rememberMe })
      .pipe(tap(response => this.token = response.token));
  }

  refresh(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, { token })
      .pipe(tap(response => this.token = response.token));
  }

  logout(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, { token })
      .pipe(tap(() => this.token = null));
  }

  getToken(): string | null {
    return this.token;
  }
}