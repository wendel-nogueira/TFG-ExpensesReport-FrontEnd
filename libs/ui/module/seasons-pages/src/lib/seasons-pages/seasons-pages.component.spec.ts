import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonsPagesComponent } from './seasons-pages.component';

describe('SeasonsPagesComponent', () => {
  let component: SeasonsPagesComponent;
  let fixture: ComponentFixture<SeasonsPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonsPagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonsPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
