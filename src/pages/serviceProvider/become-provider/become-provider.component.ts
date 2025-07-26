import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-provider',
  imports: [],
  templateUrl: './become-provider.component.html',
  styleUrl: './become-provider.component.scss',
})
export class BecomeProviderComponent {
  message = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.message = nav?.extras?.state?.['successMessage'] || '';
  }
}
