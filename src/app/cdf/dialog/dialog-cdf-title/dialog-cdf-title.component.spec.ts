import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCdfTitleComponent } from './dialog-cdf-title.component';

describe('DialogCdfTitleComponent', () => {
  let component: DialogCdfTitleComponent;
  let fixture: ComponentFixture<DialogCdfTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCdfTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCdfTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
