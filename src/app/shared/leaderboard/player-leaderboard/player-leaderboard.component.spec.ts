import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLeaderboardComponent } from './player-leaderboard.component';

describe('LeaderboardComponent', () => {
  let component: PlayerLeaderboardComponent;
  let fixture: ComponentFixture<PlayerLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerLeaderboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
