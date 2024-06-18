import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../services/notification.service';
import { MenuService } from '../services/menu.service';
import { Menu } from '../models/menu.model';

@Component({
  selector: 'app-menu-dashboard',
  templateUrl: './menu-dashboard.component.html',
  styleUrls: ['./menu-dashboard.component.scss']
})
export class MenuDashboardComponent {
  public menu: Menu = { restaurantId: 0, name: '', description: '', price: 0 };

  constructor(
    public dialogRef: MatDialogRef<MenuDashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public notificationService: NotificationService,
    public menuService: MenuService
  ) {
    this.menu.restaurantId = data.restaurant.id;
    if (data.menu){
      this.menu ={...data.menu};
    }
  }

  public saveMenu() {
    if (!this.menu.name || !this.menu.price) {
      this.notificationService.showError('Name and Price are required');
      return;
    }
    
    if (this.menu.id) {
      this.menuService.updateMenu(this.menu.id, this.menu).subscribe(
        () => {
          this.notificationService.showSuccess('Menu updated successfully');
          this.dialogRef.close(true);
        },
        error => {
          this.notificationService.showError('Error updating menu: ' + error.message);
          console.error('Error updating menu:', error);
        }
      );
    } else {
      this.menuService.saveMenu(this.menu.restaurantId, this.menu).subscribe(
        () => {
          this.notificationService.showSuccess('Menu saved successfully');
          this.dialogRef.close(true);
        },
        error => {
          this.notificationService.showError('Error saving menu: ' + error.message);
          console.error('Error saving menu:', error);
        }
      );
    }
  }
}
