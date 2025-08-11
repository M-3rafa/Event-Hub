import { Component, OnInit, NgModule } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { OurServicesComponent } from '../our-services/our-services.component';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    OurServicesComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  successMessage = '';
  errorMessage = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        userName: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: [
          null,
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            ),
          ],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.*\d).{8,}$/),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
        firstName: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        lastName: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        gender: [false],
        birthDate: [null, [Validators.required]],
      },
      {
        validators: this.passwordMatchRepassword,
      }
    );
  }
  passwordMatchRepassword(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { misMatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const value = this.form.value;

    this.auth
      .register({
        userName: value.userName,
        email: value.email,
        password: value.password,
        confirmPassword: value.confirmPassword,
        firstName: value.firstName,
        lastName: value.lastName,
        gender: value.gender,
        birthDate: value.birthDate,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful!';
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errorResponse = err.error;

          if (typeof errorResponse === 'string') {
            this.errorMessage = errorResponse; // "Username is already taken"
          } else if (errorResponse?.message) {
            this.errorMessage = errorResponse.message;
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        },
      });
  }

  get passwordMismatch(): boolean {
    return this.form.errors?.['passwordMismatch'];
  }
}
