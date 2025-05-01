import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBeReadComponent } from './to-be-read.component';

describe('ToBeReadComponent', () => {
  let component: ToBeReadComponent;
  let fixture: ComponentFixture<ToBeReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToBeReadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToBeReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
