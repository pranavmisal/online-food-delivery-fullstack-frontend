import { Component } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';
import { MenuService } from '../services/menu.service';
import { Menu } from '../models/menu.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public restaurants: any[] = [];
  public selectedRestaurant: any;
  public menus: Menu[] = [];
  public quantities: {[key: number]: number} = {};
  public reviews: {[key: number]: any[]} = {};
  public filteredRestaurants: any[] = [];
  public filteredMenus: Menu[] = [];

  constructor(
    private restaurantService: RestaurantService,
    public menuService: MenuService,
    public cartService: CartService,
    public router: Router,
    public notificationService: NotificationService
  ){}

  ngOnInit(){
    this.fetchRestaurants();
    this.cartService.itemAdded.subscribe(menuItem => {
      this.notificationService.showSuccess(`${menuItem.name} added to cart`);
    });
  }

  public fetchRestaurants(){
    this.restaurantService.getRestaurants().subscribe(
      (data: any[]) => {
        this.restaurants = data;
        this.filteredRestaurants = data;
      },
      (error) => {
        console.error('Error fetching restaurants:', error);
      }
    );
  }

  public selectRestaurant(restaurant: any) {
    this.selectedRestaurant = restaurant;
    this.fetchMenus(restaurant.id);
  }

  public fetchMenus(restaurantId: number){
    this.menuService.getMenus(restaurantId).subscribe(
      (data: Menu[]) => {
        this.menus = data;
        this.filteredMenus = data;
        this.menus.forEach(menu => {
          this.quantities[menu.id!] = 0;
          this.fetchMenuReview(menu.id!);
        });
      },
      (error) => {
        console.error('Error fetching menus:', error);
      }
    );
  }

  public incrementQuantity(menuId: number) {
    this.quantities[menuId]++;
  }

  public decrementQuantity(menuId: number){
    if (this.quantities[menuId] > 0) {
      this.quantities[menuId]--;
    }
  }

  public addToCart(menuItem: Menu) {
    const quantity = this.quantities[menuItem.id!];
    if (quantity > 0) {
      this.cartService.addToCart(menuItem, quantity);
      this.quantities[menuItem.id!] = 0;
      // this.router.navigate(['/cart']);
    }
  }

  public fetchMenuReview(menuId: number){
    this.menuService.getMenuReview(menuId).subscribe(
      (reviewData: any[]) => {
        this.reviews[menuId] = reviewData;
      },
      (error) => {
        console.error('Error fetching menu review:', error);
      }
    );
  }

  // average of menu rating
  public getAverageRating(menuId: number): number {
    const menuReviews = this.reviews[menuId];
    if (!menuReviews || menuReviews.length === 0) {
      return 0;
    }
    const totalRating = menuReviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((totalRating/menuReviews.length).toFixed(1));
  }

  // search filter for restaurants and menu items
  public applySearchFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();
    // filter restaurant
    this.filteredRestaurants = this.restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm)
    );
    // filter menus
    if (this.selectedRestaurant){
      this.filteredMenus = this.menus.filter(menu => 
        menu.name.toLowerCase().includes(searchTerm) ||
        menu.description.toLowerCase().includes(searchTerm)
      );
    }
  }
}
