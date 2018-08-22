import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRestComponent } from './password-rest.component';

describe('PasswordRestComponent', () => {
  let component: PasswordRestComponent;
  let fixture: ComponentFixture<PasswordRestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordRestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
