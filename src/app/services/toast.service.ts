import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  private getDefaultConfig(message: string, action: string): MatSnackBarConfig {
    return {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar'],
      data: { message, action },
      politeness: 'assertive'
    };
  }

  show(message: string, action: string = 'Close', duration: number = 5000): void {
    const config = this.getDefaultConfig(message, action);
    config.duration = duration;
    this.snackBar.open(message, action, config);
  }

  success(message: string, action: string = 'Close', duration: number = 5000): void {
    const config = this.getDefaultConfig(message, action);
    config.duration = duration;
    config.panelClass = ['custom-snackbar', 'success-snackbar'];
    this.snackBar.open(message, action, config);
  }

  error(message: string, action: string = 'Close', duration: number = 5000): void {
    const config = this.getDefaultConfig(message, action);
    config.duration = duration;
    config.panelClass = ['custom-snackbar', 'error-snackbar'];
    this.snackBar.open(message, action, config);
  }

  warning(message: string, action: string = 'Close', duration: number = 5000): void {
    const config = this.getDefaultConfig(message, action);
    config.duration = duration;
    config.panelClass = ['custom-snackbar', 'warning-snackbar'];
    this.snackBar.open(message, action, config);
  }
}
