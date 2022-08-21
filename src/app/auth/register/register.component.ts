import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

// import { UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';


// @UntilDestroy()
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  error: string | undefined;
  registerForm!: UntypedFormGroup;
  isLoading = false;
  // uploadedImagePath!: any;

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

  register() {
    this.isLoading = true;
    const register$ = this.authenticationService.register(this.registerForm.value);
    register$
      .pipe(
        finalize(() => {
          this.registerForm.markAsPristine();
          this.isLoading = false;
        }),
        // untilDestroyed(this)
      )
      .subscribe(
        (res) => {
          console.log(res)
          this.router.navigate([this.route.snapshot.queryParams['redirect'] || '/'], { replaceUrl: true });
        },
        (error) => {
          console.log(`Registration error: ${error}`);
          this.error = error;

          this._snackBar.open(error?.error?.message || 'Something went wrong, Plase try again later', 'Ok', {
            panelClass: ['custom-snackbar'],
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
            duration: 5000
          })
        }
      );
  }

  private createForm() {
    this.registerForm = this.formBuilder.group({
      username : ['', Validators.required],
      email    : ['' , [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      password : ['' , [Validators.required , Validators.minLength(6)]],
      picture  : ['']
    });
  }


  processFile(imageInput: HTMLInputElement) {
    console.log('Selected  :', imageInput);
    // this.showProgressBar = true;
    const file: File = imageInput?.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', (event) => {
      this.registerForm.get('picture')?.setValue(reader.result);
    });

    reader.onerror = function() {
      console.log(reader.error);
    };

  }
}
