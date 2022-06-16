import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { UntilDestroy } from '@shared';


@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
  }
}
