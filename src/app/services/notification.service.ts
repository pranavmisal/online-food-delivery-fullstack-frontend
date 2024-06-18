import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackbar: MatSnackBar) { }

  // for success
  public showSuccess(message: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  // for error
  public showError(message: string) {
    this.snackbar.open(message,'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
