import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Reader } from '../model/Reader-Model';

@Component({
  selector: 'app-data-tabel',
  templateUrl: './data-tabel.component.html',
  styleUrls: ['./data-tabel.component.css']
})
export class DataTabelComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'Humidity', 'Temperature', 'Light', 'Date'];
  dataSource = new MatTableDataSource<Reader>();//Data from api, to display datatable
  constructor() { }

  ngOnInit(): void {
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
