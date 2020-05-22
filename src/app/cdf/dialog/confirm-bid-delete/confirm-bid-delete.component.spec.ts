import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBidDeleteComponent } from './confirm-bid-delete.component';

describe('ConfirmBidDeleteComponent', () => {
  let component: ConfirmBidDeleteComponent;
  let fixture: ComponentFixture<ConfirmBidDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmBidDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBidDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
