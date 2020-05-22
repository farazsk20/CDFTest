import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { staffingDetailsComponent } from './staffingDetails.component';

describe('LOSComponent', () => {
  let component: staffingDetailsComponent;
  let fixture: ComponentFixture<staffingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [staffingDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(staffingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
