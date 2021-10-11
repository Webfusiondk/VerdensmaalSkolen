import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reader } from '../model/Reader-Model';
import { Injectable } from '@angular/core';

let header = new HttpHeaders({

  'ApiKey': 'iCMrmPuB2KKtscylfIGoFfdKl8x9SIWBdMQbZHH0vn1O2xcUejjog9QXyY5D'

});

let options = { headers: header};

@Injectable({
  providedIn: 'root'
})

export class ApiFetcherComponent {

  constructor(private http : HttpClient) { }
  
  GetAllReaderData(){
    return this.http.get<Reader[]>('https://localhost:5001/data/all', options);
  }

  GetAllRoomNrs(){
    return this.http.get<Reader[]>('https://localhost:5001/data/rooms', options);
  }

  GetReaderDataByRoomNr(roomNr){
    return this.http.get<Reader[]>(`https://localhost:5001/data/room?roomNr=${roomNr}`, options);
  }

  
}
