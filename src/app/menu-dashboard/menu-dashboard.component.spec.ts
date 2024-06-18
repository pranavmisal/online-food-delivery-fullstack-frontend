import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDashboardComponent } from './menu-dashboard.component';

describe('MenuDashboardComponent', () => {
  let component: MenuDashboardComponent;
  let fixture: ComponentFixture<MenuDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuDashboardComponent]
    });
    fixture = TestBed.createComponent(MenuDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
