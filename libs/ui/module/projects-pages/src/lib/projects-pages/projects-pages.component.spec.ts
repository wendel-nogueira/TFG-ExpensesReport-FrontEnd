import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsPagesComponent } from './projects-pages.component';

describe('ProjectsPagesComponent', () => {
  let component: ProjectsPagesComponent;
  let fixture: ComponentFixture<ProjectsPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsPagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
