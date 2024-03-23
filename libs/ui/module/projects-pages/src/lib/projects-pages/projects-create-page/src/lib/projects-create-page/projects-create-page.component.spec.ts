import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsCreatePageComponent } from './projects-create-page.component';

describe('ProjectsCreatePageComponent', () => {
  let component: ProjectsCreatePageComponent;
  let fixture: ComponentFixture<ProjectsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsCreatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
