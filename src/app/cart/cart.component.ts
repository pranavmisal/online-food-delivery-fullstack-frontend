import { Component } from '@angular/core';
import { Menu } from '../models/menu.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  public cartItems: { menuItem: Menu, quantity: number }[] = [];

  constructor(
    public cartService: CartService, 
    public router: Router, 
    public authService: AuthService,
    public notificationService: NotificationService
  ){}

  ngOnInit(){
    this.cartItems = this.cartService.getCartItems();
  }

  public clearCart(){
    this.cartService.clearCart();
    this.cartItems = [];
    this.notificationService.showError('Cart is empty');
  }

  public incrementQuantity(item: {menuItem: Menu, quantity: number}){
    this.cartService.addToCart(item.menuItem, 1);
    item.quantity;
  }

  public decrementQuantity(item: {menuItem: Menu, quantity: number}) {
    if (item.quantity > 0) {
      this.cartService.addToCart(item.menuItem, -1);
      item.quantity;
      if (item.quantity === 0){
        this.cartService.removeFromCart(item.menuItem);
        this.cartItems = this.cartService.getCartItems();
        if (this.cartItems.length === 0) {
          this.notificationService.showError('Cart is empty')
        }
      }
    }
  }

  public getTotalPrice(): number {
    // return this.cartItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
    return this.cartService.getTotalPrice();
  }

  public checkout(){
    if (this.authService.getCurrentUser()){
    this.cartService.placeOrder().subscribe(
      resonse => {
        this.cartService.clearCart();
        this.cartItems = [];
        this.notificationService.showSuccess('Order placed successfully');
        this.router.navigate(['/order-confirmation']);
      },
      error => {
        console.error('Error placing order', error);
        alert('Failed to place order.');
      }
    );
    } else {
      this.notificationService.showError("Please login first.");
      this.router.navigate(['/login']);
    }
  }
}
