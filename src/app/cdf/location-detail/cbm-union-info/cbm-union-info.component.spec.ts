import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbmUnionInfoComponent } from './cbm-union-info.component';

describe('CbmUnionInfoComponent', () => {
  let component: CbmUnionInfoComponent;
  let fixture: ComponentFixture<CbmUnionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbmUnionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbmUnionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
