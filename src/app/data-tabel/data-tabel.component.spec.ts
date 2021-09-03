import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTabelComponent } from './data-tabel.component';

describe('DataTabelComponent', () => {
  let component: DataTabelComponent;
  let fixture: ComponentFixture<DataTabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
