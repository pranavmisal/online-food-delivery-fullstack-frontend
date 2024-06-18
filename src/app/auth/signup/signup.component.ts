import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  public user = { username: '', fullName: '', email: '', mobile: '', password: '', address: '' };

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService,
    public router: Router
  ){}

  public signup(){
    this.authService.signup(this.user).subscribe(
      response => {
        this.notificationService.showSuccess('Sign up successful');
        console.log('Sign up successful', response);
        this.router.navigate(['/login']);
      },
      error => {
        this.notificationService.showError('Sign up failed: ' + error.error.message);
        console.error('Sign up failed', error);
      }
    );
  }
}
