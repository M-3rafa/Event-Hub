import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form: any;
  successMessage = '';
  errorMessage = '';
  loading = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userNameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.tokenService.saveToken(res.token);
        this.tokenService.saveUser(res.userName, res.email, res.roles);
        this.successMessage = 'Login successful!';
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  showPassword: boolean = false;
}
