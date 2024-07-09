import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { OrderHistory } from '../models/order-history.model';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  public orderHistory: OrderHistory[] = [];
  public user: any;
  public paginatedOrderHistory: OrderHistory[] = [];
  public pageSize = 3;
  public currentPage = 0;
  public totalPages = 0;
  public filteredOrderHistory: OrderHistory[] = [];

  constructor(
    public orderService: OrderService, 
    public authService: AuthService,
    public dialog: MatDialog,
    public notificationService: NotificationService
  ){}

  ngOnInit(){
    this.fetchOrderHistory();
    this.fetchUserDetails();
  }

  // fetch user details
  public fetchUserDetails(){
    this.authService.currentUser$.subscribe(
      (user) => {
        if (user) {
          this.user = user;
          
        }
      }
    );
  }

  // fetch order details
  public fetchOrderHistory(){
    this.orderService.getOrderHistory().subscribe(
      (data: OrderHistory[]) => {
        this.orderHistory = data;
        this.filteredOrderHistory = this.orderHistory;
        this.updatePagination();
      },
      error => {
        console.error('Error fetching order history:', error);
      }
    );
  }

  // prev page
  public prevPage(){
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedOrderHistory();
    }
  }

  // next page
  public nextPage(){
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedOrderHistory();
    }
  }

  public updatePagination(){
    this.totalPages = Math.ceil(this.filteredOrderHistory.length / this.pageSize);
    this.updatePaginatedOrderHistory();
  }

  public updatePaginatedOrderHistory(){
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrderHistory = this.filteredOrderHistory.slice(startIndex, endIndex);
  }

  // date filter
  public applyDateFilter(event: Event){
    const input = event .target as HTMLInputElement;
    const selectedDate = new Date(input.value);
    if (input.value) {
      this.filteredOrderHistory = this.orderHistory.filter(order => {
        const orderDate = new Date(order.order_date);
        return orderDate.toDateString() === selectedDate.toDateString();
      });
    } else {
      this.filteredOrderHistory = this.orderHistory;
    }
    this.currentPage = 0;
    this.updatePagination();
  }

  // open profile editing dialog
  public openEditProfileDialog(){
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '500px',
      data: {user: this.user}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.updateProfile(this.user.id, result).subscribe(
          updatedUser => {
            this.user = updatedUser;
            this.notificationService.showSuccess('Profile updated successfully');
          },
          error => {
            console.error('Error updating profile:', error);
            this.notificationService.showError('Failed to update profile');
          }
        )
      }
    })
  }
  
  // submit review and rating for an order
  public submitReviewRating(reviewRating: {rating: number, review: string}, order: OrderHistory){
    this.orderService.submitReview(order.id, reviewRating).subscribe(
      updatedOrder => {
        const orderIndex = this.orderHistory.findIndex(o => o.id === updatedOrder.id);
        if (orderIndex !== -1){
          this.orderHistory[orderIndex] = updatedOrder;
          this.orderHistory[orderIndex].rating = parseFloat(updatedOrder.rating.toFixed(1));
        }
        this.notificationService.showSuccess('Review submitted successfully');
      },
      error => {
        console.error('Error submitting review:', error);
        this.notificationService.showError('Failed to submit review');
      }
    );
  }
}
