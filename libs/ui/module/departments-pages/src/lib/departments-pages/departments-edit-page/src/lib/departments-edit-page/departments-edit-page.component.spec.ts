import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentsEditPageComponent } from './departments-edit-page.component';

describe('DepartmentsEditPageComponent', () => {
  let component: DepartmentsEditPageComponent;
  let fixture: ComponentFixture<DepartmentsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentsEditPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
