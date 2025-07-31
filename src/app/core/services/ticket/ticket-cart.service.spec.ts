import { TestBed } from '@angular/core/testing';

import { TicketCartService } from './ticket-cart.service';

describe('TicketCartService', () => {
  let service: TicketCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
