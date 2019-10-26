import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckFormDialogComponent } from './check-form-dialog.component';

describe('CheckFormDialogComponent', () => {
  let component: CheckFormDialogComponent;
  let fixture: ComponentFixture<CheckFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
