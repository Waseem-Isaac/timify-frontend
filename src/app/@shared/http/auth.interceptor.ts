import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth';


/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private credentials: CredentialsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.credentials.credentials ? this.credentials.credentials.token : '';

    if (token?.length) {
      request = request.clone({
        headers: request.headers
          .set('Authorization', `Bearer ${token}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Accept-Language', 'en'),
      });
    }

    return next.handle(request);
  }
}
