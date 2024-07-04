import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonsCreatePageComponent } from './seasons-create-page.component';

describe('SeasonsCreatePageComponent', () => {
  let component: SeasonsCreatePageComponent;
  let fixture: ComponentFixture<SeasonsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonsCreatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
