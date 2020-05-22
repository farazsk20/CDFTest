import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AesUnionInfoComponent } from './aes-union-info.component';

describe('AesUnionInfoComponent', () => {
  let component: AesUnionInfoComponent;
  let fixture: ComponentFixture<AesUnionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AesUnionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AesUnionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
