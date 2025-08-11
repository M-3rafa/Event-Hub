import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../core/environment/environment';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  categories = [
    {
      name: 'Concert',
      imageUrl: `assets/images/concert.jpeg`,
      description: 'Live music events and concerts',
      route: 'User/EventList',
    },
    {
      name: 'Sport',
      imageUrl: `assets/images/Sport.jpeg`,
      description: 'Sports competitions and tournaments',
      route: 'User/EventList',
    },
    {
      name: 'Theatre',
      imageUrl: `assets/images/Theatre.jpg`,
      description: 'Drama, comedy, and performing arts',
      route: 'User/EventList',
    },
    {
      name: 'Place',
      imageUrl: `assets/images/images.jpeg`,
      description: 'Cofee, Hall, and performing arts',
      route: 'User/Places',
    },
  ];
}
