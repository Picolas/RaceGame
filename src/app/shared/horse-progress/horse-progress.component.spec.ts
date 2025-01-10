import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseProgressComponent } from './horse-progress.component';

describe('HorseProgressComponent', () => {
  let component: HorseProgressComponent;
  let fixture: ComponentFixture<HorseProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorseProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorseProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
