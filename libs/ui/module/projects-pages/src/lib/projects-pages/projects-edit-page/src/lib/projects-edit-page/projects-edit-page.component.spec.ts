import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsEditPageComponent } from './projects-edit-page.component';

describe('ProjectsEditPageComponent', () => {
  let component: ProjectsEditPageComponent;
  let fixture: ComponentFixture<ProjectsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsEditPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
