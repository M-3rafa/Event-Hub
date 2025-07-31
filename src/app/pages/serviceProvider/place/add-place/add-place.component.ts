import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { ProviderPlaceService } from '../../../../core/services/providerPlace/provider-place.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-place',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-place.component.html',
  styleUrl: './add-place.component.scss',
})
export class AddPlaceComponent implements AfterViewInit, OnDestroy {
  form: FormGroup;
  imagePreview: string | null = null;
  marker: L.Marker | null = null;
  map: L.Map | null = null;

  placeTypes: string[] = ['Hall', 'Stadium', 'Café', 'Other'];
  errorMsg = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private placeService: ProviderPlaceService,
    private router: Router
  ) {
    this.form = this.fb.group({
      placeTypeName: ['', Validators.required],
      location: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      maxAttendees: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      stripePaymentLink: ['', Validators.required],
      image: [null, Validators.required],
      securityClearance: [null, Validators.required],
      ownershipOrRentalContract: [null, Validators.required],
      nationalIdFront: [null, Validators.required],
      nationalIdBack: [null, Validators.required],
    });
  }

  ngAfterViewInit(): void {
    const defaultLatLng: L.LatLngExpression = [30.0444, 31.2357];
    this.map = L.map('placeMap', {
      center: defaultLatLng,
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker(defaultLatLng, { draggable: true }).addTo(this.map);
    this.updateLatLngInForm([30.0444, 31.2357]);

    this.marker.on('dragend', (e: any) => {
      const latLng = (e.target as L.Marker).getLatLng();
      this.updateLatLngInForm([latLng.lat, latLng.lng]);
    });

    this.map.on('click', (e: any) => {
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
        this.updateLatLngInForm([e.latlng.lat, e.latlng.lng]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.marker = null;
  }

  updateLatLngInForm(latlng: [number, number]) {
    this.form.patchValue({
      latitude: latlng[0],
      longitude: latlng[1],
    });
  }

  onFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    this.form.patchValue({ [controlName]: file });

    if (controlName === 'image' && file) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
      console.log('imge URL' + reader.readAsDataURL(file));
    }
  }

  onSubmit() {
    this.errorMsg = '';
    if (this.form.invalid) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }

    this.submitting = true;
    const formData = new FormData();
    formData.append('placeTypeName', this.form.value.placeTypeName || '');
    formData.append('location', this.form.value.location || '');
    formData.append('latitude', this.form.value.latitude?.toString() || '');
    formData.append('longitude', this.form.value.longitude?.toString() || '');
    formData.append(
      'maxAttendees',
      this.form.value.maxAttendees?.toString() || '1'
    );
    formData.append('price', this.form.value.price?.toString() || '0');
    formData.append(
      'stripePaymentLink',
      this.form.value.stripePaymentLink || ''
    );

    [
      'image',
      'securityClearance',
      'ownershipOrRentalContract',
      'nationalIdFront',
      'nationalIdBack',
    ].forEach((field) => {
      if (this.form.value[field]) {
        formData.append(field, this.form.value[field]);
      }
    });

    this.placeService
      .addPlace(formData)
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Place added successfully');
          this.router.navigate(['/my-places']);
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to add place';
        },
      })
      .add(() => {
        this.submitting = false;
      });
  }
}
