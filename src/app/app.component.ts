import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layouts/footer/footer.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { TokenService } from './core/services/token.service';
import { CommonModule } from '@angular/common';
import { SpaceBackgroundComponent } from './layouts/space-background/space-background.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CommonModule,
    SpaceBackgroundComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'event-hub';
  isLoggedIn = false;

  constructor(private tokenService: TokenService) {}
  ngOnInit(): void {
    this.tokenService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }
}
