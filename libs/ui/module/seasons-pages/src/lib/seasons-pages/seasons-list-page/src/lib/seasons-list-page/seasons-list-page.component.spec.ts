import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonsListPageComponent } from './seasons-list-page.component';

describe('SeasonsListPageComponent', () => {
  let component: SeasonsListPageComponent;
  let fixture: ComponentFixture<SeasonsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonsListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
