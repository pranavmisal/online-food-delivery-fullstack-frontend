import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { OrderHistory } from '../models/order-history.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public apiUrl = 'http://localhost:3000/api';
  constructor(public http: HttpClient, public authService: AuthService) { }

  public getOrderHistory(): Observable<any> {
    const user = this.authService.getCurrentUser();
    return this.http.get<OrderHistory[]>(`${this.apiUrl}/users/${user.id}/orders`);
  }

  public submitReview(ordderId: number, review: {rating: number; review: string}): Observable<OrderHistory> {
    return this.http.post<OrderHistory>(`${this.apiUrl}/orders/${ordderId}/review`, review);
  }
}
