import { TestBed } from '@angular/core/testing';

import { ProviderDashboardService } from './provider-dashboard.service';

describe('ProviderDashboardService', () => {
  let service: ProviderDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
