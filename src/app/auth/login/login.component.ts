import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public credentials = { identifier: '', password: '' };

  constructor(
    public authService: AuthService, 
    public router: Router,
    public notificationService: NotificationService
  ){}

  public login(){
    this.authService.login(this.credentials).subscribe(
      response => {
        this.notificationService.showSuccess('Login successful')
        console.log('Login successful', response);
        this.router.navigate(['/home']);
      },
      error => {
        this.notificationService.showError('Login failed: ' + error.error.message)
        console.error('Login failed', error);
      }
    );
  }
}
