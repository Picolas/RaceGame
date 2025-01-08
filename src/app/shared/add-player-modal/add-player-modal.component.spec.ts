import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlayerModalComponent } from './add-player-modal.component';

describe('AddPlayerModalComponent', () => {
  let component: AddPlayerModalComponent;
  let fixture: ComponentFixture<AddPlayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlayerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
