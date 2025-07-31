import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceAvailabilityComponent } from './place-availability.component';

describe('PlaceAvailabilityComponent', () => {
  let component: PlaceAvailabilityComponent;
  let fixture: ComponentFixture<PlaceAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
