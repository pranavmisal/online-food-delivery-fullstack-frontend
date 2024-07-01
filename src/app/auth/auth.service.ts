import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { Address } from '../models/user.model';

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
    if (this.currentUserSubject.value) {
      return throwError(() => new Error('User is already logged in.'));
    }
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      catchError(error => {
        if (error.status === 401) {
          if (error.error.message === 'Invalid username') {
            return throwError(() => new Error('Username is incorrect.'));
          } else if (error.error.message === 'Invalid password') {
            return throwError(() => new Error('Password is incorrect.'));
          } else {
            return throwError(() => new Error('Authentication failed.'));
          }
        } else {
          return throwError(() => error);
        }
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
  
  // fetch current user from API or local storage
  public getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // fetch addresses for the current user
  public getUserAddresses(userId: number): Observable<Address[]>{
    return this.http.get<Address[]>(`${this.apiUrl}/users/${userId}/addresses`);
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

  // for updating the profile image
  public updateProfileImage(userId: string, image: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/profile/${userId}/image`, image).pipe(
      tap((updatedUser) => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
    );
  }

  // forgot password
  public forgotPassword(identifier: string, newPassword: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/forgot-password`, {identifier, newPassword}).pipe(
      tap(response => {
        console.log('Forgot password response:', response);
      }),
      catchError(error => {
        console.error('Error in forgot password:', error);
        return throwError(() => error);
      })
    )
  }
}
