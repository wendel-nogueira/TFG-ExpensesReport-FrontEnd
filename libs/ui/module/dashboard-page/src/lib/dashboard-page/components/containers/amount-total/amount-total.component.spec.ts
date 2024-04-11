import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountTotalComponent } from './amount-total.component';

describe('AmountTotalComponent', () => {
  let component: AmountTotalComponent;
  let fixture: ComponentFixture<AmountTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmountTotalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmountTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
