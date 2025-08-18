import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
import { UrlServiceService } from '../../../../core/services/url/url-service.service';

@Component({
  selector: 'app-place-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './place-list.component.html',
  styleUrl: './place-list.component.scss',
})
export class PlaceListComponent implements OnInit {
  places: any[] = [];
  filteredPlaces: any[] = [];
  loading = true;
  errorMsg = '';
  placeTypes: string[] = [];
  selectedType = '';
  searchTerm = '';

  constructor(
    private placesService: UserService,
    private router: Router,
    private imgURL: UrlServiceService
  ) {}

  ngOnInit() {
    this.fetchPlaces();
  }

  fetchPlaces() {
    this.loading = true;
    this.placesService.getPlaces().subscribe({
      next: (data) => {
        this.places = data;
        this.placeTypes = Array.from(
          new Set(data.map((p) => p.placeTypeName))
        ).filter(Boolean);
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load places';
        this.loading = false;
      },
    });
  }

  imgUrl(url: any): string {
    return this.imgURL.getFullImageUrl(url);
  }
  applyFilters() {
    this.filteredPlaces = this.places.filter(
      (p) =>
        (!this.selectedType || p.placeTypeName === this.selectedType) &&
        (!this.searchTerm ||
          p.location.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  goToPlaceDetails(id: number) {
    this.router.navigate(['/User/PlacesDetails', id]);
  }
}
