import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBooksPageComponent } from './read-books-page.component';

describe('ReadBooksPageComponent', () => {
  let component: ReadBooksPageComponent;
  let fixture: ComponentFixture<ReadBooksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadBooksPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadBooksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
