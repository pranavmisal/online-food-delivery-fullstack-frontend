import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantService } from '../services/restaurant.service';
import { NotificationService } from '../services/notification.service';
import { MenuService } from '../services/menu.service';
import { Menu } from '../models/menu.model';
import { MenuDashboardComponent } from '../menu-dashboard/menu-dashboard.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public restaurant = { name: '', address: '', image_url: '', mobile: '' };
  public restaurants: any[] = [];
  public selectedRestaurant: any;
  public menus: Menu[] = [];

  constructor(
    public restaurantService: RestaurantService,
    public notificationService: NotificationService,
    public menuService: MenuService,
    public dialog: MatDialog
  ){}

  ngOnInit() {
    this.fetchRestaurants();
  }

  public saveRestaurant() {
    if (this.selectedRestaurant) {
      this.restaurantService.updateRestaurant(this.selectedRestaurant.id, this.restaurant).subscribe(
        (response) => {
          this.notificationService.showSuccess('Restaurant updated successfully');
          this.fetchRestaurants();
          this.resetForm();
        },
        error => {
          this.notificationService.showError('Error updating restaurant: ' + error.message);
          console.error('Error updating restaurant:', error);
        }
      );
    } else {
      this.restaurantService.saveRestaurant(this.restaurant).subscribe(
        (response) => {
          this.notificationService.showSuccess('Restaurant saved successfully');
          this.fetchRestaurants();
          this.resetForm();
          console.log('Restaurant saved successfully');
        },
        error => {
          this.notificationService.showError('Error saving restaurant: ' + error.message);
          console.error('Error saving restaurant:', error);
        }
      );
    }
  }

  // public fetchRestaurants() {
  //   this.restaurantService.getRestaurants().subscribe(
  //     (data: any[]) => {
  //       this.restaurants = data;
  //     },
  //     (error) => {
  //       this.notificationService.showError('Error fetching restaurants: ' + error.message);
  //       console.error('Error fetching restaurants:', error);
  //     }
  //   );
  // }

  public fetchRestaurants(){
    this.restaurantService.getRestaurants().subscribe(
      (restaurants: any[]) => {
        restaurants.forEach(restaurant => {
          this.menuService.getMenus(restaurant.id).subscribe(
            (menus: Menu[]) => {
              restaurant.menuCount = menus.length;
            },
            (error) => {
              restaurant.menuCount = 0;
              this.notificationService.showError('Error fetching menus: ' + error.message);
              console.error('Error fetching menus:', error);
            }
          );
        });
        this.restaurants = restaurants;
      },
      (error) => {
        this.notificationService.showError('Error fetching restaurants: ' + error.message);
        console.error('Error fetching restaurants:', error);
      }
    );
  }

  public editRestaurant(restaurant: any) {
    this.selectedRestaurant = { ...restaurant };
    this.restaurant = { ...restaurant };
    this.fetchMenus(restaurant.id);
  }

  public deleteRestaurant(restaurant: any) {
    this.restaurantService.deleteRestaurant(restaurant.id).subscribe(
      () => {
        this.notificationService.showSuccess('Restaurant deleted successfully');
        this.fetchRestaurants();
      },
      error => {
        this.notificationService.showError('Error deleting restaurant: ' + error.message);
      }
    );
  }

  public viewMenus(restaurant: any){
    console.log('Viewing menus for restaurant:', restaurant);
    this.selectedRestaurant = restaurant;
    this.fetchMenus(restaurant.id);
  }

  public fetchMenus(restaurantId: number) {
    console.log('Fetching menus for restaurantId: ', restaurantId);
    this.menuService.getMenus(restaurantId).subscribe(
      (data: Menu[]) => {
        this.menus = data;
      },
      (error) => {
        this.notificationService.showError('Error fetching menus: ' + error.message);
        console.error('Error fetching menus:', error);
      }
    );
  }

  public openAddMenuDialog(restaurant: any) {
    const dialogRef = this.dialog.open(MenuDashboardComponent, {
      width: '400px',
      data: { restaurant }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchMenus(restaurant.id);
        this.updateMenuCount(restaurant.id);
      }
    });
  }

  public openEditMenuDialog(menu: Menu) {
    const dialogRef = this.dialog.open(MenuDashboardComponent, {
      width: '400px',
      data: { restaurant: this.selectedRestaurant, menu: menu }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchMenus(this.selectedRestaurant.id);
      }
    });
  }

  public deleteMenu(menu: Menu) {
    if (menu.id) {
      this.menuService.deleteMenu(menu.id).subscribe(
        () => {
          this.notificationService.showSuccess('Menu deleted successfully');
          this.fetchMenus(menu.restaurantId);
        },
        error => {
          this.notificationService.showError('Error deleting menu: ' + error.message);
          console.error('Error deleting menu:', error);
        }
      );
    }
  }

  public resetForm() {
    this.selectedRestaurant = null;
    this.restaurant = { name: '', address: '', image_url: '', mobile: '' };
    this.menus = [];
  }

  public onFileSelected(event: any){
    const file: File = event.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.restaurant.image_url = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  public updateMenuCount(restaurantId: number){
    this.menuService.getMenus(restaurantId).subscribe(
      (menus: Menu[]) => {
        const restaurant = this.restaurants.find(r => r.id === restaurantId);
        if (restaurant){
          restaurant.menuCount = menus.length;
        }
      },
      (error) => {
        this.notificationService.showError('Error fetching menus: ' + error.message);
        console.error('Error fetching menus:', error);
      }
    );
  }
}
