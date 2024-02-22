import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuExpandedComponent } from './menu-expanded.component';

describe('MenuExpandedComponent', () => {
  let component: MenuExpandedComponent;
  let fixture: ComponentFixture<MenuExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuExpandedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
