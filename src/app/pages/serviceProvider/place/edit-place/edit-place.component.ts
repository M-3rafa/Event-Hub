import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import L from 'leaflet';
import { ProviderPlaceService } from '../../../../core/services/providerPlace/provider-place.service';
import { CommonModule } from '@angular/common';
import { UrlServiceService } from '../../../../core/services/url/url-service.service';
import { ImagePreviewService } from '../../../../core/services/shared/services/image-preview.service';

@Component({
  selector: 'app-edit-place',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-place.component.html',
  styleUrl: './edit-place.component.scss',
})
export class EditPlaceComponent implements OnInit, AfterViewInit, OnDestroy {
  form: FormGroup;
  imagePreview: string | null = null;
  placeId: number = 0;

  current: {
    imageUrl?: string | null;
    securityClearanceUrl?: string | null;
    ownershipOrRentalContractUrl?: string | null;
    nationalIdFrontUrl?: string | null;
    nationalIdBackUrl?: string | null;
  } = {};

  marker: L.Marker | null = null;
  map: L.Map | null = null;

  placeTypes: string[] = ['Hall', 'Stadium', 'Café', 'Other'];
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private placeService: ProviderPlaceService,
    private UrlService: UrlServiceService,
    private imagePreviewService: ImagePreviewService
  ) {
    this.form = this.fb.group({
      placeTypeName: ['', Validators.required],
      location: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      maxAttendees: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      stripePaymentLink: ['', Validators.required],
      image: [null],
      securityClearance: [null],
      ownershipOrRentalContract: [null],
      nationalIdFront: [null],
      nationalIdBack: [null],
    });
  }

  ngOnInit(): void {
    this.placeId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchPlace();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 200);
  }

  fetchPlace() {
    this.loading = true;

    this.placeService.loadPlaceForEdit(this.placeId).subscribe({
      next: ({ formData, currentFiles }) => {
        this.form.patchValue(formData);
        this.current = currentFiles;

        if (this.current.imageUrl) {
          this.imagePreview = this.current.imageUrl;
        }

        setTimeout(() => this.setMapMarker(), 200);
        this.loading = false;
      },
      error: () => {
        alert('Failed to load place details');
        this.router.navigate(['/my-places']);
        this.loading = false;
      },
    });
  }

  initMap() {
    if (this.map) return;
    const defaultLatLng: L.LatLngExpression = [30.0444, 31.2357];
    this.map = L.map('editPlaceMap', {
      center: defaultLatLng,
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.setMapMarker();

    this.map.on('click', (e: any) => {
      if (!this.marker) {
        this.marker = L.marker(e.latlng, { draggable: true }).addTo(this.map!);
        this.marker.on('dragend', (evt: any) => {
          const latLng = (evt.target as L.Marker).getLatLng();
          this.updateLatLngInForm([latLng.lat, latLng.lng]);
        });
      } else {
        this.marker.setLatLng(e.latlng);
      }
      this.updateLatLngInForm([e.latlng.lat, e.latlng.lng]);
    });
  }

  setMapMarker() {
    const lat = Number(this.form.value.latitude);
    const lng = Number(this.form.value.longitude);
    if (!this.map || isNaN(lat) || isNaN(lng)) return;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map!);
      this.marker.on('dragend', (e: any) => {
        const latLng = (e.target as L.Marker).getLatLng();
        this.updateLatLngInForm([latLng.lat, latLng.lng]);
      });
    }
    this.map.setView([lat, lng], 13);
  }

  updateLatLngInForm(latlng: [number, number]) {
    this.form.patchValue({
      latitude: latlng[0],
      longitude: latlng[1],
    });
  }

  onFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ [controlName]: file });
      if (controlName === 'image') {
        const reader = new FileReader();
        reader.onload = () => (this.imagePreview = reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  }
  onSubmit() {
    this.errorMsg = '';
    if (this.form.invalid) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('placeTypeName', this.form.value.placeTypeName);
    formData.append('location', this.form.value.location);
    formData.append('latitude', this.form.value.latitude.toString());
    formData.append('longitude', this.form.value.longitude.toString());
    formData.append('maxAttendees', this.form.value.maxAttendees.toString());
    formData.append('price', this.form.value.price.toString());
    formData.append('stripePaymentLink', this.form.value.stripePaymentLink);

    const files = [
      'image',
      'securityClearance',
      'ownershipOrRentalContract',
      'nationalIdFront',
      'nationalIdBack',
    ];
    for (const key of files) {
      const file = this.form.get(key)?.value;
      if (file instanceof File) {
        formData.append(key, file);
      }
    }

    this.placeService.updatePlace(this.placeId.toString(), formData).subscribe({
      next: (res: any) => {
        alert(
          res.message ||
            'Place updated successfully. Waiting for admin approval.'
        );
        this.router.navigate(['/my-places']);
      },
      error: (err) => {
        this.errorMsg = 'Failed to update place';
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getFullFileUrl(url: string | null): string {
    if (!url) return '';
    return this.UrlService.getFullImageUrl(url);
  }

  openImage(url: string) {
    url = this.getFullFileUrl(url);
    this.imagePreviewService.showImage(url);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.marker = null;
  }
}
