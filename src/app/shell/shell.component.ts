import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { AuthenticationService, Credentials, CredentialsService } from '@app/auth';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  private _isSmall = false;
  isDarkMode = true;

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private breakpoint: BreakpointObserver
  ) {}

  ngOnInit() {}

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get credentials(): Credentials | null {
    const credentials = this.credentialsService.credentials;
    return credentials || null
  }

  get isSmall(): boolean {
    return this._isSmall
  }

  
  public set isSmall(v : boolean) {
    this._isSmall = v
  }
  


  get title(): string {
    return this.titleService.getTitle();
  }
}
