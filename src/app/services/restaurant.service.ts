import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://localhost:3000/api/restaurants';

  constructor(
    private http: HttpClient,
    public notificationService: NotificationService
  ) {}

  // Method to fetch all restaurants with average rating
  // public getRestaurants(): Observable<any> {
  //   return this.http.get<any[]>(this.apiUrl).pipe(
  //     catchError(error => {
  //       this.notificationService.showError('Failed to fetch restaurant: ' + error.message);
  //       throw error;
  //     })
  //   );
  // }
  public getRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/with-ratings`).pipe(
      catchError(error => {
        this.notificationService.showError('Failed to fetch restaurants: ' + error.message);
        throw error;
      })
    )
  }

  // Method to fetch menu of a specific restaurant
  public getMenu(restaurantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${restaurantId}/menu`);
  }

  // save restaurants
  public saveRestaurant(restaurant: any): Observable<any>{
    return this.http.post(`${this.apiUrl}`, restaurant).pipe(
      tap(() => this.notificationService.showSuccess('Restaurant added successfully')),
      catchError(error => {
        this.notificationService.showError('Failed to add restaurant: ' + error.message);
        throw error;
      })
    );
  }

  // update existing restaurant
  public updateRestaurant(id: string, restaurant: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, restaurant).pipe(
      tap(() => this.notificationService.showSuccess('Restaurant update successfully')),
      catchError(error => {
        this.notificationService.showError('Failed to update restaurant: ' + error.message);
        throw error;
      })
    );
  }

  // for delete restaurant
  public deleteRestaurant(id: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.notificationService.showSuccess('Restaurant deleted successfully')),
      catchError(error => {
        this.notificationService.showError('Failed to delete restaurant: ' + error.message);
        throw error;
      })
    );
  }
}
