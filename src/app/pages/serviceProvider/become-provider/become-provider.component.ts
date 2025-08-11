import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProviderRequestService } from '../../../core/services/user/provider-request.service';

@Component({
  selector: 'app-become-provider',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './become-provider.component.html',
  styleUrl: './become-provider.component.scss',
})
export class BecomeProviderComponent {
  form: FormGroup;
  errorMsg = '';
  successMsg = '';
  submitting = false;

  nationalIdFrontPreview: string | null = null;
  nationalIdBackPreview: string | null = null;
  holdingIdPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private providerRequestService: ProviderRequestService
  ) {
    this.form = this.fb.group({
      nationalIdFront: [null, Validators.required],
      nationalIdBack: [null, Validators.required],
      holdingId: [null, Validators.required],
      stripePaymentLink: [''],
    });
  }

  onFileSelected(event: any, control: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ [control]: file });
      const reader = new FileReader();
      reader.onload = () => {
        if (control === 'nationalIdFront')
          this.nationalIdFrontPreview = reader.result as string;
        if (control === 'nationalIdBack')
          this.nationalIdBackPreview = reader.result as string;
        if (control === 'holdingId')
          this.holdingIdPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.form.invalid) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }
    this.submitting = true;

    const formData = new FormData();
    formData.append('nationalIdFront', this.form.value.nationalIdFront);
    formData.append('nationalIdBack', this.form.value.nationalIdBack);
    formData.append('holdingId', this.form.value.holdingId);
    formData.append(
      'stripePaymentLink',
      this.form.value.stripePaymentLink || ''
    );

    this.providerRequestService
      .requestServiceProvider(formData)
      .subscribe({
        next: () => {
          this.successMsg =
            'Your request has been submitted. Await admin approval!';
          this.form.reset();
          this.nationalIdFrontPreview = null;
          this.nationalIdBackPreview = null;
          this.holdingIdPreview = null;
        },
        error: (err) => {
          this.errorMsg =
            err.error?.message ||
            'Submission failed. You may have a pending request.';
        },
      })
      .add(() => (this.submitting = false));
  }
}
