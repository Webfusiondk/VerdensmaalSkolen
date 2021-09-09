import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Reader } from '../model/Reader-Model';
import { ApiFetcherComponent } from '../Helpers/api-fetcher.component';

@Component({
  selector: 'app-data-tabel',
  templateUrl: './data-tabel.component.html',
  styleUrls: ['./data-tabel.component.css']
})

export class DataTabelComponent implements OnInit {
  readerData: any;
  dataSource;
  displayedColumns: string[] = ['RoomNumber', 'Humidity', 'Temperature', 'Light', 'Date'];

  constructor(private apiFetcher: ApiFetcherComponent) { 

  }
  
  ngOnInit(): void {
    this.load_data();
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  async load_data() {
    await this.apiFetcher.GetAllReaderData()
    .subscribe(data => {
      this.readerData = data;
      this.dataSource = new MatTableDataSource<Reader>(this.readerData);
      this.dataSource.paginator = this.paginator;
      console.log(this.readerData);
      console.log(this.dataSource);
  })
  }
}
