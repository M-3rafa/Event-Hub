import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvailabilityService } from '../../../../core/services/providerPlace/availability.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-place-availability',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './place-availability.component.html',
  styleUrl: './place-availability.component.scss',
})
export class PlaceAvailabilityComponent implements OnInit {
  placeId!: number;
  blockedDates: Date[] = [];

  constructor(
    private availabilityService: AvailabilityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('ok ,ma');
    this.placeId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchBlockedDates();
  }

  fetchBlockedDates() {
    this.availabilityService.getAvailability(this.placeId).subscribe({
      next: (res) => {
        this.blockedDates = res
          .filter((d) => d.isBlocked)
          .map((d) => new Date(d.date));
      },
      error: (err) => {
        alert('Failed to load availability');
        console.error(err);
      },
    });
  }

  isBlocked(date: Date): boolean {
    return this.blockedDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  }

  onDateSelect(date: Date) {
    if (!date) return;
    this.isBlocked(date) ? this.unblockDate(date) : this.blockDate(date);
  }

  blockDate(date: Date) {
    this.availabilityService.blockDate(this.placeId, date).subscribe({
      next: () => this.blockedDates.push(date),
      error: (err) => {
        alert('Failed to block date');
        console.error(err);
      },
    });
  }

  unblockDate(date: Date) {
    this.availabilityService.getAvailability(this.placeId).subscribe({
      next: (res) => {
        const match = res.find((d) => {
          const ddate = new Date(d.date);
          return (
            ddate.getFullYear() === date.getFullYear() &&
            ddate.getMonth() === date.getMonth() &&
            ddate.getDate() === date.getDate()
          );
        });

        if (match) {
          this.availabilityService.unblockDateById(match.id).subscribe({
            next: () => {
              this.blockedDates = this.blockedDates.filter(
                (d) =>
                  !(
                    d.getFullYear() === date.getFullYear() &&
                    d.getMonth() === date.getMonth() &&
                    d.getDate() === date.getDate()
                  )
              );
            },
            error: (err) => {
              alert('Failed to unblock date');
              console.error(err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error fetching availability for unblocking', err);
      },
    });
  }
}
