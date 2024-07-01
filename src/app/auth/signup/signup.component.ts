import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  public signupForm!: FormGroup;
  public loading = false;

  // public user = { 
  //   username: '', 
  //   fullName: '', 
  //   email: '', 
  //   mobile: '', 
  //   password: '',
  //   addressLine1: '',
  //   addressLine2: '',
  //   city: '',
  //   state: '',
  //   postalCode: '',
  //   country: ''
  // };

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public notificationService: NotificationService,
    public router: Router
  ){}

  ngOnInit(){
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required], 
      fullName: ['', Validators.required], 
      email: ['', Validators.required], 
      mobile: ['', Validators.required], 
      password: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    })
  }

  // public signup(){
  //   this.authService.signup(this.user).subscribe(
  //     response => {
  //       this.notificationService.showSuccess('Sign up successful');
  //       console.log('Sign up successful', response);
  //       this.router.navigate(['/login']);
  //     },
  //     error => {
  //       this.notificationService.showError('Sign up failed: ' + error.error.message);
  //       console.error('Sign up failed', error);
  //     }
  //   );
  // }

  public onSubmit(){
    if (this.signupForm.invalid){
      return;
    }
    this.loading = true;
    this.authService.signup(this.signupForm.value).subscribe(
      response => {
        this.notificationService.showSuccess('Sign up successful');
        console.log('Sign up successful', response);
        this.router.navigate(['/login']);
      },
      error => {
        this.notificationService.showError('Sign up failed: ' + error.error.message);
        console.error('Sign up failed', error);
        this.loading = false;
      }
    )
  }
}
