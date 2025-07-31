import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardeComponent } from './dashboarde.component';

describe('DashboardeComponent', () => {
  let component: DashboardeComponent;
  let fixture: ComponentFixture<DashboardeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
