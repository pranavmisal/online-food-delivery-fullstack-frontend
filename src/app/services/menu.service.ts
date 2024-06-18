import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public apiUrl = 'http://localhost:3000/api/restaurants';

  constructor(public http: HttpClient) { }

  public getMenus(restaurantId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/${restaurantId}/menus`);
  }

  public saveMenu(restaurantId: number, menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(`${this.apiUrl}/${restaurantId}/menus`, menu);
  }

  public updateMenu(menuId: number, menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`http://localhost:3000/api/menus/${menuId}`, menu);
  }

  public deleteMenu(menuId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/menus/${menuId}`);
  }

  public getMenuReview(menuId: number): Observable<any>{
    return this.http.get<any>(`http://localhost:3000/api/menus/${menuId}/reviews`)
  }
}
