import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { AuthenticationService } from '@app/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private router: Router, private _snackBar: MatSnackBar) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error) => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
      console.log('Request error', response);
    }

    if ((response instanceof HttpErrorResponse) && response['status'] === 401) {
      this.authService.logout().subscribe(() => {

        this._snackBar.open(response?.error?.message || 'Email or password are incorrect', 'Ok', {
          panelClass: ['custom-snackbar'],
          horizontalPosition: 'left',
          verticalPosition: 'bottom'
        });

        this.router.navigate(['/login'], { replaceUrl: true })
      });
    }

    throw response;
  }
}
