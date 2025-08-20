import { Component, OnInit } from '@angular/core';
import { ProviderPlaceService } from '../../../core/services/providerPlace/provider-place.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PlaceReservation {
  id: number;
  placeLocation: string;
  placeType: string;
  reservedDate: string;
  price: number;
  status: string;
  userId: string;
}

interface PlaceStats {
  placeName: string;
  reservationsCount: number;
  totalRevenue: number;
  netRevenue: number;
}

@Component({
  selector: 'app-place-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './place-dashboard.component.html',
  styleUrls: ['./place-dashboard.component.scss'],
})
export class PlaceDashboardComponent implements OnInit {
  reservations: PlaceReservation[] = [];
  filteredReservations: PlaceReservation[] = [];
  stats: PlaceStats[] = []; // 👈 إضافة الإحصائيات
  loading = false;
  error = '';

  selectedStatus: 'All' | 'Confirmed' | 'Pending' = 'All';
  searchText: string = '';

  constructor(private providerService: ProviderPlaceService) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.error = '';
    this.providerService.getMyPlaceReservations().subscribe({
      next: (data: PlaceReservation[]) => {
        this.reservations = data;
        this.applyFilters();
        this.calculateStats(); // 👈 حساب الإحصائيات بعد التحميل
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load reservations';
        this.loading = false;
      },
    });
  }

  // تطبيق الفلتر حسب الحالة والنص
  applyFilters() {
    this.filteredReservations = this.reservations.filter((r) => {
      const matchesStatus =
        this.selectedStatus === 'All' || r.status === this.selectedStatus;
      const matchesSearch =
        r.placeLocation.toLowerCase().includes(this.searchText.toLowerCase()) ||
        r.placeType.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    this.calculateStats(); // 👈 تحديث الإحصائيات بعد الفلترة
  }

  selectStatus(status: 'All' | 'Confirmed' | 'Pending') {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSearchChange(text: string) {
    this.searchText = text;
    this.applyFilters();
  }

  calculateStats() {
    const grouped: { [key: string]: PlaceStats } = {};

    // ناخد فقط Confirmed للحساب
    this.filteredReservations
      .filter((r) => r.status === 'Confirmed')
      .forEach((r) => {
        if (!grouped[r.placeLocation]) {
          grouped[r.placeLocation] = {
            placeName: r.placeLocation,
            reservationsCount: 0,
            totalRevenue: 0,
            netRevenue: 0,
          };
        }
        grouped[r.placeLocation].reservationsCount++;
        grouped[r.placeLocation].totalRevenue += r.price;
        grouped[r.placeLocation].netRevenue += r.price * 0.95; // بعد خصم 8% منصة
      });

    this.stats = Object.values(grouped);
  }
}
