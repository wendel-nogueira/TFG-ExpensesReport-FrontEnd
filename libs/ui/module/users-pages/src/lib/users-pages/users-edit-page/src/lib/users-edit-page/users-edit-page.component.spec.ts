import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersEditPageComponent } from './users-edit-page.component';

describe('UsersEditPageComponent', () => {
  let component: UsersEditPageComponent;
  let fixture: ComponentFixture<UsersEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersEditPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
