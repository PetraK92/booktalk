import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBookshelfComponent } from './profile-bookshelf.component';

describe('ProfileBookshelfComponent', () => {
  let component: ProfileBookshelfComponent;
  let fixture: ComponentFixture<ProfileBookshelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileBookshelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileBookshelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
