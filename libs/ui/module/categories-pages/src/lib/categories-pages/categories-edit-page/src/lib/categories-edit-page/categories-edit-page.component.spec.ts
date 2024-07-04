import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesEditPageComponent } from './categories-edit-page.component';

describe('CategoriesEditPageComponent', () => {
  let component: CategoriesEditPageComponent;
  let fixture: ComponentFixture<CategoriesEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesEditPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
