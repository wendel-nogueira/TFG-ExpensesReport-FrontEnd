import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentsPagesComponent } from './departments-pages.component';

describe('DepartmentsPagesComponent', () => {
  let component: DepartmentsPagesComponent;
  let fixture: ComponentFixture<DepartmentsPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentsPagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentsPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
