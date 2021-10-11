import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reader } from '../model/Reader-Model';
import { Injectable } from '@angular/core';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { BehaviorSubject, Observable } from 'rxjs';

let header = new HttpHeaders({
  'ApiKey': 'iCMrmPuB2KKtscylfIGoFfdKl8x9SIWBdMQbZHH0vn1O2xcUejjog9QXyY5D'
});
let options = { headers: header};


@Injectable({
  providedIn: 'root'
})


export class ApiFetcherComponent {

  tempToken: Token;
  token: Observable<Token>
  private tokenSubject: BehaviorSubject<Token>;
  constructor(private http : HttpClient) {
    this.tokenSubject = new BehaviorSubject<Token>(JSON.parse(localStorage.getItem('token')));
    this.token = this.tokenSubject.asObservable();
   }

  GetLocalToken(): Token{
    return this.tokenSubject.value;
  }

  GetAllReaderData(){
    return this.http.get<Reader[]>('https://localhost:5001/data/all',options);
  }

  GetAllRoomNrs(){
    return this.http.get<Reader[]>('https://localhost:5001/data/rooms',options);
  }

  GetReaderDataByRoomNr(roomNr){
    return this.http.get<Reader[]>(`https://localhost:5001/data/room?roomNr=${roomNr}`,options);
  }

  Test(){
    return this.http.get<Token>('https://localhost:5001/token/GetToken', options)
    .subscribe(data =>{
      console.log(data)
      this.tempToken = <Token>data;
      localStorage.setItem('token',JSON.stringify(this.tempToken));
      this.tokenSubject.next(data);
      return this.tempToken;
    })
  }

  UpdateSession(){
    return this.http.post('https://localhost:5001/token/Update', this.tokenSubject.value, options) 
  }
}
