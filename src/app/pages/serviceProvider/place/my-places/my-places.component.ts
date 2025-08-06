import { Component, OnInit } from '@angular/core';
import { ProviderPlaceService } from '../../../../core/services/providerPlace/provider-place.service';
import { Router, RouterLink } from '@angular/router';
import { UrlServiceService } from '../../../../core/services/url/url-service.service';
import { ImagePreviewService } from '../../../../core/services/shared/services/image-preview.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-places',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-places.component.html',
  styleUrl: './my-places.component.scss',
})
export class MyPlacesComponent implements OnInit {
  places: any[] = [];
  loading = true;

  constructor(
    private placeService: ProviderPlaceService,
    private urlService: UrlServiceService,
    private router: Router,
    private imagePreviewService: ImagePreviewService
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

  openImage(url: string) {
    url = this.getFullImageUrl(url);
    this.imagePreviewService.showImage(url);
  }

  goToEditPlace(placeId: string): void {
    this.router.navigate(['dashboard/editPlace', placeId]);
  }

  goToAvailability(placeId: string): void {
    console.log('PlaceAvailability/:id' + placeId);
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
