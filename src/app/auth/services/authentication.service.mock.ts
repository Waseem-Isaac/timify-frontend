import { LoginContext } from '@app/@shared/interfaces';
import { Observable, of } from 'rxjs';

import { Credentials } from './credentials.service';

export class MockAuthenticationService {
  credentials: Credentials | null = {
    email: 'test',
    token: '123',
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      email: context.email,
      token: '123456',
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }
}
