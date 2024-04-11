import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountByDepartmentComponent } from './amount-by-department.component';

describe('AmountByDepartmentComponent', () => {
  let component: AmountByDepartmentComponent;
  let fixture: ComponentFixture<AmountByDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmountByDepartmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmountByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
