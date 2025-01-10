import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndPilonComponent } from './end-pilon.component';

describe('EndPilonComponent', () => {
  let component: EndPilonComponent;
  let fixture: ComponentFixture<EndPilonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndPilonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndPilonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
