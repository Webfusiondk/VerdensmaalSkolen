import { HttpClient } from '@angular/common/http';
import { Reader } from '../model/Reader-Model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiFetcherComponent {

  constructor(private http : HttpClient) { }
  
  GetAllReaderData(){
    console.log("Trying to get data");
    return this.http.get<Reader[]>('https://localhost:44338/data/all');
  }
}
