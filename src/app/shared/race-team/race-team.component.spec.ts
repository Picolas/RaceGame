import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceTeamComponent } from './race-team.component';

describe('RaceTeamComponent', () => {
  let component: RaceTeamComponent;
  let fixture: ComponentFixture<RaceTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
