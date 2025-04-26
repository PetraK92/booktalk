import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbrPageComponent } from './tbr-page.component';

describe('TbrPageComponent', () => {
  let component: TbrPageComponent;
  let fixture: ComponentFixture<TbrPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TbrPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TbrPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
