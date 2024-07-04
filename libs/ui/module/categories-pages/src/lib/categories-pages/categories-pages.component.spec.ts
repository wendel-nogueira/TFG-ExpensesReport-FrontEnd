import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesPagesComponent } from './categories-pages.component';

describe('CategoriesPagesComponent', () => {
  let component: CategoriesPagesComponent;
  let fixture: ComponentFixture<CategoriesPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesPagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
