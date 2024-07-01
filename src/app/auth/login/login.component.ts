import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public forgotPasswordForm!: FormGroup;
  public loading = false;
  public showForgotPassword = false;
  public failedAttempts = 0;
  private readonly maxAttempts = 3;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService, 
    public router: Router,
    public notificationService: NotificationService
  ){}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.formBuilder.group({
      identifier: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  public toggleForgotPassword(){
    this.showForgotPassword = !this.showForgotPassword;
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        this.notificationService.showSuccess('Login successful');
        console.log('Login successful', response);
        this.failedAttempts = 0;
        this.router.navigate(['/home']);
      },
      error => {
        this.failedAttempts++;
        if(this.failedAttempts >= this.maxAttempts){
          this.notificationService.showError('Maximum login attempts exceeded. Please try again later.');
        } else {
          const attemptsLeft = this.maxAttempts - this.failedAttempts;
          this.notificationService.showWarning(`Login failed. You have ${attemptsLeft} attempt(s) left.`);
        }

        if (error.message === 'User is already logged in.') {
          this.notificationService.showError('You are already logged in. Please log out first.');
        } else if (error.message === 'Username is incorrect.'){
          this.notificationService.showError('Username is incorrect')
        } else if (error.message === 'Password is incorrect') {
          this.notificationService.showError('Password is incorrect');
        } else {
          // const errorMessage = error.error && error.error.message ? error.error.message : 'Unknown error occurred.';
          // this.notificationService.showError('Login failed: ' + errorMessage);
        }
        console.error('Login failed', error);
        this.loading = false;
      }
    );
  }

  public onForgotPasswordSubmit(){
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const {identifier, newPassword, confirmPassword} = this.forgotPasswordForm.value;
    if (newPassword !== confirmPassword) {
      this.notificationService.showError('New password and confirm password do not match.');
      return;
    }
    this.loading = true;
    this.authService.forgotPassword(identifier, newPassword).subscribe(
      response => {
        this.notificationService.showSuccess('Password changed successfully. You can now login.');
        console.log('Password changes successfully', response);
        this.toggleForgotPassword();
      },
      error => {
        const errorMessage = error.error && error.error.message ? error.error.message : 'Failed to reset password.';
        this.notificationService.showError(errorMessage);
        console.log('Failed to reset password', error);
      }
    )
  }
}
