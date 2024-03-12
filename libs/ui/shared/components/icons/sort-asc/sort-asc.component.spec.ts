import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortAscComponent } from './sort-asc.component';

describe('SortAscComponent', () => {
  let component: SortAscComponent;
  let fixture: ComponentFixture<SortAscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortAscComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SortAscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
