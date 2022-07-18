import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: UntypedFormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          console.log(`${credentials.email} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams['redirect'] || '/'], { replaceUrl: true });
        },
        (error) => {
          console.log(`Login error: ${error}`);
          this.error = error;

          this._snackBar.open(error?.error?.message || 'Email or password are incorrect', 'Ok', {
            panelClass: ['custom-snackbar'],
            horizontalPosition: 'left',
            verticalPosition: 'bottom'
          })
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email    : ['' , [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      password : ['' , [Validators.required , Validators.minLength(6)]],
      remember: true,
    });
  }
}
