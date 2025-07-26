import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-event',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
})
export class AddEventComponent {
  eventForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      name: [''],
      eventType: ['Concert'],
      date: [''],
      placeName: [''],
      isTicketed: [false],
      teamA: [''],
      teamB: [''],
      stadiumName: [''],
      performers: [''],
      ticketTypes: this.fb.array([]),
    });

    // Add 2 default ticket types
    this.addTicketType();
    this.addTicketType();
  }

  get ticketTypes(): FormArray {
    return this.eventForm.get('ticketTypes') as FormArray;
  }

  addTicketType(): void {
    const ticketGroup = this.fb.group({
      name: [''],
      price: [''],
      quantity: [1], // <-- quantity field
    });
    this.ticketTypes.push(ticketGroup);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    const formValues = this.eventForm.value;

    formData.append('name', formValues.name ?? '');
    formData.append('eventType', formValues.eventType ?? '');
    formData.append('date', new Date(formValues.date).toISOString());
    formData.append('placeName', formValues.placeName ?? '');
    formData.append('isTicketed', formValues.isTicketed.toString());

    if (formValues.eventType === 'Match') {
      formData.append('teamA', formValues.teamA ?? '');
      formData.append('teamB', formValues.teamB ?? '');
      formData.append('stadiumName', formValues.stadiumName ?? '');
    } else if (formValues.eventType === 'Concert') {
      formData.append('performers', formValues.performers ?? '');
    } else {
      formData.append('placeName', formValues.placeName ?? '');
    }

    formValues.ticketTypes.forEach((ticket: any, index: number) => {
      formData.append(`ticketTypes[${index}].name`, ticket.name ?? '');
      formData.append(`ticketTypes[${index}].price`, ticket.price ?? '0');
      formData.append(`ticketTypes[${index}].quantity`, ticket.quantity ?? '1');
    });

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    this.eventService.addEvent(formData).subscribe({
      next: (res: any) => {
        console.log('✅ Event added:', res);
        this.router.navigate(['/my-events']);
      },
      error: (err: any) => {
        console.error('🟥 Server Error:', err);
      },
    });
  }
}
