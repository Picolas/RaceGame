import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNameComponent } from './team-name.component';

describe('PlayerNameComponent', () => {
  let component: TeamNameComponent;
  let fixture: ComponentFixture<TeamNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
