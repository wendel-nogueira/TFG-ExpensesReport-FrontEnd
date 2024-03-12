import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortDescComponent } from './sort-desc.component';

describe('SortDescComponent', () => {
  let component: SortDescComponent;
  let fixture: ComponentFixture<SortDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortDescComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SortDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
