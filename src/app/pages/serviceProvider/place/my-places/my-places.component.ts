import { Component, OnInit } from '@angular/core';
import { ProviderPlaceService } from '../../../../core/services/providerPlace/provider-place.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../core/environment/environment';
import { UrlServiceService } from '../../../../core/services/url/url-service.service';

@Component({
  selector: 'app-my-places',
  imports: [CommonModule],
  templateUrl: './my-places.component.html',
  styleUrl: './my-places.component.scss',
})
export class MyPlacesComponent implements OnInit {
  places: any[] = [];
  loading = true;

  constructor(
    private placeService: ProviderPlaceService,
    private urlService: UrlServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyPlaces();
  }

  loadMyPlaces(): void {
    this.loading = true;
    this.placeService.getMyPlaces().subscribe({
      next: (res: any[]) => {
        this.places = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading places:', err);
        this.loading = false;
      },
    });
  }

  getFullImageUrl(img: string): string {
    if (!img) return '';
    return this.urlService.getFullImageUrl(img);
  }

  goToEditPlace(placeId: string): void {
    this.router.navigate(['dashboard/editPlace', placeId]);
  }

  goToAvailability(placeId: string): void {
    this.router.navigate(['/dashboard/PlaceAvailability', placeId]);
  }

  deletePlace(placeId: string): void {
    const confirmed = confirm('Are you sure you want to delete this place?');
    if (!confirmed) return;

    this.placeService.deletePlace(placeId).subscribe({
      next: () => {
        this.loadMyPlaces();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete place!');
      },
    });
  }
}
