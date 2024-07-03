import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonsEditPageComponent } from './seasons-edit-page.component';

describe('SeasonsEditPageComponent', () => {
  let component: SeasonsEditPageComponent;
  let fixture: ComponentFixture<SeasonsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonsEditPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
