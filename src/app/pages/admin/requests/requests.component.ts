import id from '@angular/common/locales/id';
import { Component, OnInit } from '@angular/core';
import { ClientRequest, IncomingMessage, request, RequestOptions } from 'http';
import { environment } from '../../../core/environment/environment';
import { ProviderRequestService } from '../../../core/services/admin/provider-request.service';
import { URL } from 'url';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProviderRequest } from '../../../models/provider-request';

@Component({
  selector: 'app-requests',
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
})
export class RequestsComponent implements OnInit {
  requests: ProviderRequest[] = [];
  selectedRequest: ProviderRequest | null = null;
  rejectNote = '';
  errorMsg = '';
  loading = false;

  constructor(private requestService: ProviderRequestService) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.loading = true;
    this.requestService.getAllRequests().subscribe({
      next: (res) => (this.requests = res),
      error: () => (this.errorMsg = '⚠️ Failed to load requests'),
      complete: () => (this.loading = false),
    });
  }

  approve(id: number): void {
    if (!confirm('✅ Approve this provider request?')) return;

    this.requestService.approveRequest(id).subscribe({
      next: () => {
        this.removeRequestFromList(id);
        this.closeModal();
      },
      error: () => (this.errorMsg = '❌ Failed to approve request'),
    });
  }

  reject(id: number): void {
    if (!this.rejectNote.trim()) {
      this.errorMsg = '⚠️ Rejection note is required!';
      return;
    }

    this.requestService.rejectRequest(id, this.rejectNote).subscribe({
      next: () => {
        this.removeRequestFromList(id);
        this.closeModal();
      },
      error: () => (this.errorMsg = '❌ Failed to reject request'),
    });
  }

  view(request: ProviderRequest): void {
    this.selectedRequest = request;
    this.rejectNote = '';
    this.errorMsg = '';
  }

  closeModal(): void {
    this.selectedRequest = null;
    this.rejectNote = '';
    this.errorMsg = '';
  }

  getFullUrl(url?: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `${environment.baseUrl}${url}`;
  }

  private removeRequestFromList(id: number): void {
    this.requests = this.requests.filter((r) => r.id !== id);
  }
}

function ngOnInit() {
  throw new Error('Function not implemented.');
}

function fetchRequests() {
  throw new Error('Function not implemented.');
}

function approve(
  id: (
    | string
    | number
    | number[]
    | (string | undefined)[]
    | ((val: number) => number)
    | (string[] | undefined)[]
    | {
        AUD: string[];
        BYN: (string | undefined)[];
        IDR: string[];
        INR: string[];
        JPY: string[];
        PHP: (string | undefined)[];
        THB: string[];
        TWD: string[];
        USD: string[];
        XXX: never[];
      }
    | undefined
  )[],
  number: any
) {
  throw new Error('Function not implemented.');
}

function reject(
  id: (
    | string
    | number
    | number[]
    | (string | undefined)[]
    | ((val: number) => number)
    | (string[] | undefined)[]
    | {
        AUD: string[];
        BYN: (string | undefined)[];
        IDR: string[];
        INR: string[];
        JPY: string[];
        PHP: (string | undefined)[];
        THB: string[];
        TWD: string[];
        USD: string[];
        XXX: never[];
      }
    | undefined
  )[],
  number: any
) {
  throw new Error('Function not implemented.');
}

function view(
  request: {
    (
      options: RequestOptions | string | URL,
      callback?: (res: IncomingMessage) => void
    ): ClientRequest;
    (
      url: string | URL,
      options: RequestOptions,
      callback?: (res: IncomingMessage) => void
    ): ClientRequest;
  },
  ProviderRequest: any
) {
  throw new Error('Function not implemented.');
}

function closeModal() {
  throw new Error('Function not implemented.');
}

function getFullUrl(arg0: any) {
  throw new Error('Function not implemented.');
}

function removeRequestFromList(
  id: (
    | string
    | number
    | number[]
    | (string | undefined)[]
    | ((val: number) => number)
    | (string[] | undefined)[]
    | {
        AUD: string[];
        BYN: (string | undefined)[];
        IDR: string[];
        INR: string[];
        JPY: string[];
        PHP: (string | undefined)[];
        THB: string[];
        TWD: string[];
        USD: string[];
        XXX: never[];
      }
    | undefined
  )[],
  number: any
) {
  throw new Error('Function not implemented.');
}
