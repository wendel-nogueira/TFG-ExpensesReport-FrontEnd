import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalByStatusComponent } from './total-by-status.component';

describe('TotalByStatusComponent', () => {
  let component: TotalByStatusComponent;
  let fixture: ComponentFixture<TotalByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalByStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
