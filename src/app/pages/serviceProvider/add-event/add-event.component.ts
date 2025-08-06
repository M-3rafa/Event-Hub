import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-add-event',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
})
export class AddEventComponent implements AfterViewInit, OnDestroy {
  addForm: FormGroup;
  selectedFiles: { [key: string]: File | null } = {};
  submitting = false;
  errorMsg = '';
  eventTypes = ['Concert', 'Match', 'Other'];

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      eventType: ['', Validators.required],
      date: ['', Validators.required],
      description: [''],
      stadiumName: [''],
      teamA: [''],
      teamB: [''],
      performers: [''],
      placeName: [''],
      stripePaymentLink: [''],
      ticketTypes: this.fb.array([], Validators.required),
      locationAddress: [''], // NEW
      latitude: [''], // NEW
      longitude: [''], // NEW
    });
  }

  get ticketTypesFormArray() {
    return this.addForm.get('ticketTypes') as FormArray;
  }

  addTicketType() {
    this.ticketTypesFormArray.push(
      this.fb.group({
        name: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(1)]],
        quantity: [0, [Validators.required, Validators.min(1)]],
      })
    );
  }
  removeTicketType(index: number) {
    this.ticketTypesFormArray.removeAt(index);
  }

  onFileSelected(event: any, type: string) {
    if (event.target.files && event.target.files.length) {
      this.selectedFiles[type] = event.target.files[0];
    }
  }

  get eventType() {
    return this.addForm.get('eventType')?.value;
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const L = await import('leaflet');

    if (this.map) return;

    const defaultLatLng: L.LatLngExpression = [30.0444, 31.2357];

    this.map = L.map('eventMap', {
      center: defaultLatLng,
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker(defaultLatLng, { draggable: true }).addTo(this.map);

    this.updateLatLngInForm([
      (defaultLatLng as [number, number])[0],
      (defaultLatLng as [number, number])[1],
    ]);

    this.marker.on('dragend', (e: any) => {
      const latLng = (e.target as any).getLatLng();
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
  }

  updateLatLngInForm(latlng: [number, number]) {
    this.addForm.patchValue({
      latitude: latlng[0],
      longitude: latlng[1],
    });
  }

  // Rest of your logic (validation, submit, etc.) -- unchanged
  submit() {
    this.errorMsg = '';

    if (this.addForm.invalid) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }
    if (this.ticketTypesFormArray.length === 0) {
      this.errorMsg = 'Please add at least one ticket type.';
      return;
    }
    const requiredFiles = [
      'Image',
      'SecurityClearance',
      'PublicLicenseFront',
      'PublicLicenseBack',
      'CivilProtectionApprovalFront',
      'CivilProtectionApprovalBack',
    ];
    const missingFiles = requiredFiles.filter(
      (field) => !this.selectedFiles[field]
    );
    if (missingFiles.length > 0) {
      this.errorMsg = `Please upload all required documents (${missingFiles.join(
        ', '
      )})`;
      return;
    }
    if (this.eventType === 'Match') {
      if (
        !this.addForm.value.stadiumName ||
        !this.addForm.value.teamA ||
        !this.addForm.value.teamB
      ) {
        this.errorMsg = 'Please fill all Match fields.';
        return;
      }
    }
    if (this.eventType === 'Concert') {
      if (!this.addForm.value.performers || !this.addForm.value.placeName) {
        this.errorMsg = 'Please fill all Concert fields.';
        return;
      }
    }
    if (this.eventType === 'Other') {
      if (!this.addForm.value.placeName) {
        this.errorMsg = 'Please fill the Place Name.';
        return;
      }
    }

    this.submitting = true;
    const formData = new FormData();

    Object.entries(this.addForm.value).forEach(([key, val]) => {
      if (key === 'ticketTypes') {
        (val as any[]).forEach((t, idx) => {
          formData.append(`TicketTypes[${idx}].Name`, t.name ?? '');
          formData.append(`TicketTypes[${idx}].Price`, t.price ?? 0);
          formData.append(`TicketTypes[${idx}].Quantity`, t.quantity ?? 0);
        });
      } else if (key === 'performers' && this.eventType === 'Concert') {
        formData.append(
          key,
          val && typeof val === 'string'
            ? JSON.stringify(val.split(',').map((x: string) => x.trim()))
            : ''
        );
      } else {
        formData.append(
          key,
          val === null || val === undefined
            ? ''
            : typeof val === 'object'
            ? JSON.stringify(val)
            : String(val)
        );
      }
    });

    const docFields = [
      'Image',
      'SecurityClearance',
      'PublicLicenseFront',
      'PublicLicenseBack',
      'CivilProtectionApprovalFront',
      'CivilProtectionApprovalBack',
      'EventInsurance',
    ];
    docFields.forEach((field) => {
      if (this.selectedFiles[field]) {
        formData.append(field, this.selectedFiles[field]!);
      }
    });

    this.eventService.addEvent(formData).subscribe({
      next: () => {
        this.router.navigate(['/my-events']);
      },
      error: () => {
        this.errorMsg = 'Failed to add event!';
        this.submitting = false;
      },
    });
  }
}
