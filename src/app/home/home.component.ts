import { Component, OnInit } from '@angular/core';
import { ApiFetcherComponent } from '../Helpers/api-fetcher.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private apiFetcher : ApiFetcherComponent) { }

  ngOnInit(): void {
    this.SessionActive();
  }
  
  SessionActive(){
    this.apiFetcher.ValidateSession().subscribe(data =>{
      if (data != true) {
        localStorage.removeItem("token")
      }
    })
  }
}
