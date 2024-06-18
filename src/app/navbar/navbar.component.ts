import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public user: any;
  public isAdmin: boolean = false;
  public totalItemCount: number = 0;

  constructor(
    public authService: AuthService, 
    public router: Router,
    public notificationService: NotificationService,
    public cartService: CartService
  ){}

  ngOnInit(){
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.isAdmin = user?.email == 'admin@admin.com';
    });
    this.cartService.itemAdded.subscribe(() => {
      this.totalItemCount = this.cartService.getTotalItemCount();
    });
    this.cartService.cartCleared.subscribe(() => {
      this.totalItemCount = 0;
    });
  }

  public updateCartCount(){
    this.totalItemCount = this.cartService.getTotalItemCount();
  }

  public goToProfile(){
    this.router.navigate(['/profile']);
  }

  public logout(){
    this.authService.logout().subscribe(() => {
      this.user = null;
      this.notificationService.showSuccess('Logout Successful');
      this.isAdmin = false;
      this.router.navigate(['/home']);
    });
  }
}
