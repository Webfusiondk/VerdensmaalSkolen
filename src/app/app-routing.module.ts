import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTabelComponent } from './data-tabel/data-tabel.component';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [
  {path: '',component: HomeComponent},
  {path: 'data', component: DataTabelComponent},
  {path: 'chart', component: ChartComponent },

  //If path is incorect redirect to start page
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
