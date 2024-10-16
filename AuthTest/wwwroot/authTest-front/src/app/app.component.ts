import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'authTest-front';
  username = '';
  password = '';
  rememberMe = false;
  token: string | null = null;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.username, this.password, this.rememberMe).subscribe(response => {
      this.token = response.token;
    });
  }

  logout() {
    if (this.token) {
      this.authService.logout(this.token).subscribe(() => {
        this.token = null;
      });
    }
  }
}