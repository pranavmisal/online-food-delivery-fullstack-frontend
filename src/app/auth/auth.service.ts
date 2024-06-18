import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = 'http://localhost:3000/api/auth';
  public currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();
  
  constructor(public http: HttpClient) { 
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
   }

  // for login
  public login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  // for signup
  public signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  // for logout
  public logout(): Observable<any> {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    return of(null);
  }

  // for fetching order history
  public getOrderHistory(): Observable<any>{
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return this.http.get(`${this.apiUrl}/orders/${currentUser.id}`);
    }
    return of(null);
  }
  
  public getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // update the user profile
  public updateProfile(userId: string, userProfile: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/profile/${userId}`, userProfile).pipe(
      tap((updatedUser) => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
    );
  }
}
