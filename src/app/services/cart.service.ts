import { EventEmitter, Injectable } from '@angular/core';
import { Menu } from '../models/menu.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cart: {menuItem: Menu, quantity: number}[] = [];
  public itemAdded: EventEmitter<Menu> = new EventEmitter<Menu>();
  // public cartCleared = new Subject<void>();
  public cartCleared: EventEmitter<void> = new EventEmitter<void>();

  constructor(public http: HttpClient, public authService: AuthService) { }

  public addToCart(menuItem: Menu, quantity: number = 1){
    const existingItem = this.cart.find(item => item.menuItem.id === menuItem.id);
    if (existingItem){
      existingItem.quantity += quantity;
    } else {
      this.cart.push({menuItem, quantity});
    }
    this.itemAdded.emit(menuItem);
  }

  public getCartItems(){
    return this.cart;
  }

  public clearCart(){
    this.cart = [];
    this.cartCleared.emit();
  }

  public getTotalItemCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  public getTotalPrice(): number{
    return this.cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  }

  public placeOrder(){
    const user = this.authService.getCurrentUser();
    const orderDetails = this.cart.map(item => ({
      menu_item_id: item.menuItem.id,
      quantity: item.quantity,
      total_price: item.menuItem.price * item.quantity
    }));

    const orderData = {
      user_id: user.id,
      orderItems: orderDetails,
      total_price: this.getTotalPrice()
    };
    return this.http.post('/api/orders', orderData);
  }
}
