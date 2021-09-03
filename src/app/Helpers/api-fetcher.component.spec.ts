import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiFetcherComponent } from './api-fetcher.component';

describe('ApiFetcherComponent', () => {
  let component: ApiFetcherComponent;
  let fixture: ComponentFixture<ApiFetcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiFetcherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiFetcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
