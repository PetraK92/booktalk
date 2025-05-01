import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentlyReadingComponent } from './currently-reading.component';

describe('CurrentlyReadingComponent', () => {
  let component: CurrentlyReadingComponent;
  let fixture: ComponentFixture<CurrentlyReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentlyReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentlyReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
