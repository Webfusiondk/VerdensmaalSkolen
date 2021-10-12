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
  rooms;
  displayedColumns: string[] = ['RoomNumber', 'Humidity', 'Temperature', 'Light', 'Date'];

  constructor(private apiFetcher: ApiFetcherComponent) { 

  }
  
  ngOnInit(): void {
    this.load_all_data();
    this.load_rooms();
    this.SessionActive();
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  async load_all_data() {
    await this.apiFetcher.GetAllReaderData()
    .subscribe(data => {
      this.readerData = data;
      this.dataSource = new MatTableDataSource<Reader>(this.readerData);
      this.dataSource.paginator = this.paginator;
  })
  }

  async load_room_data(roomNr){
    await this.apiFetcher.GetReaderDataByRoomNr(roomNr)
    .subscribe(data => {
      this.readerData = data;
      this.dataSource = new MatTableDataSource<Reader>(this.readerData);
      this.dataSource.paginator = this.paginator;
  })
  }

  test(){
    this.apiFetcher.Test()
  }

  async load_rooms(){
    await this.apiFetcher.GetAllRoomNrs()
    .subscribe(data => {
      this.readerData = data;
      this.rooms = this.readerData;
  })
  }

  SessionActive(){
    this.apiFetcher.ValidateSession(this.apiFetcher.token).subscribe(data =>{
      console.log(data)
      if (data != true) {
        localStorage.removeItem("token")
      }
    })
  }

}
