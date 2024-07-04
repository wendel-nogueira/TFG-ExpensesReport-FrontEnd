import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalByTypeComponent } from './total-by-type.component';

describe('TotalByTypeComponent', () => {
  let component: TotalByTypeComponent;
  let fixture: ComponentFixture<TotalByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalByTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
