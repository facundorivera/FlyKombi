import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidedashComponent } from './sidedash.component';

describe('SidedashComponent', () => {
  let component: SidedashComponent;
  let fixture: ComponentFixture<SidedashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidedashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidedashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
