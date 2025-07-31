import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenDetailsComponent } from './even-details.component';

describe('EvenDetailsComponent', () => {
  let component: EvenDetailsComponent;
  let fixture: ComponentFixture<EvenDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvenDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
