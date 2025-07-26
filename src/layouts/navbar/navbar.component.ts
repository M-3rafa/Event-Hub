import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  role: string | null = null;
  isLoggedIn = false;
  router: any;

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    this.tokenService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        const user = this.tokenService.getUser();
        this.role = user?.roles || [];
      } else {
        this.role = null;
      }
    });
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/home']);
  }
}
