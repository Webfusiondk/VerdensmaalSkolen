import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reader } from '../model/Reader-Model';

@Component({
  selector: 'app-api-fetcher',
  templateUrl: './api-fetcher.component.html',
  styleUrls: ['./api-fetcher.component.css']
})
export class ApiFetcherComponent implements OnInit {

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
  }

  
  GetAllReaderData(){
    return this.http.get<Reader[]>(``)
  }
}
