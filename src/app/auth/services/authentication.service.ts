import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginContext, RegisterContext } from '@app/@shared/interfaces';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Credentials, CredentialsService } from './credentials.service';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private _http: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    return this._http.post('login', context).pipe(
      map((res: any) => {            
        const data: Credentials = {
          email: context.email,
          token: res?.token,
          picture: res?.userData?.picture,
          userId: res?.userData?._id
        };

        this.credentialsService.setCredentials(data, context.remember);
        return data;
      })
    );
    
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  register(context: RegisterContext): Observable<any> {
    // Replace by proper authentication call
    return this._http.post('users', context);
  }
}
