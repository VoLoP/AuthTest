import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .subscribe(response => {
        localStorage.setItem('access_token', response.token);
        this.router.navigate(['dashboard']);
      });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['login']);
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }
}