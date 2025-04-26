import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBooksComponent } from './read-books.component';

describe('ReadBooksComponent', () => {
  let component: ReadBooksComponent;
  let fixture: ComponentFixture<ReadBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
