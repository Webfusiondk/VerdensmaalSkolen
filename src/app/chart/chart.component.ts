import { Component, OnInit } from '@angular/core';
import { Chart, registerables, LineController,LinearScale,PointElement,LineElement,CategoryScale } from 'chart.js';
import { ApiFetcherComponent } from '../Helpers/api-fetcher.component';
import { Humidity } from '../model/Humidity';
import { Reader } from '../model/Reader-Model';
import { Temperture } from '../model/Temperature';
Chart.register(LineController,LinearScale,PointElement,LineElement,CategoryScale);
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  readerData: any
  constructor(private apiFetcher: ApiFetcherComponent) { }
  
  ngOnInit(): void {
    this.GetData()
  }

  CreateLinarChart(data, labels){
    const config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Light',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: data,
        }]
      },
      options: {}
    };
    var myChart = new Chart('LinarChart',config as any);
  }

  CreateLinarProgressiveChart(data, data2){
    const totalDuration = 10000;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, 
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      }
    };

    const config = {
      type: 'line',
      data: {
        datasets: [{
          borderColor: 'red',
          borderWidth: 1,
          radius: 0,
          data: data,
        },
        {
          borderColor: 'blue',
          borderWidth: 1,
          radius: 0,
          data: data2,
        }]
      },
      options: {
        animation,
        interaction: {
          intersect: false
        },
        plugins: {
          legend: false
        },
        scales: {
          x: {
            type: 'linear'
          }
        }
      }
    };
    var myChart = new Chart('LinarProgressiveChart',config as any);
  }

  async GetData(){
    await this.apiFetcher.GetAllReaderData()
    .subscribe(data => {
      this.readerData = data
      this.Get100NewReads(data)
    })
  }

  Get100NewReads(data: any){
    var tempdata = []
    if (data.length >= 100) {
      for (let index = data.length - 100; index < data.length; index++) {
       tempdata.push(data[index])
      }
      this.SplitObj(tempdata)
    }
    else
      this.SplitObj(data)
  }

  SplitObj(data: any){
    var celciusdata = []
    var humiditydata = []
    var lightdata = []
    for (let index = 0; index < data.length; index++) {
      celciusdata.push(data[index]["temperature"]["value"])
      humiditydata.push(data[index]["humidity"]["value"])
      lightdata.push(data[index]["light"]["value"])
    }
    if (celciusdata != null || humiditydata != null) {
      this.SetCelciusAndHumidity(celciusdata,humiditydata)
    }
    if (lightdata != null){
      this.SetLight(lightdata)
    }
  }

  SetLight(light){
    const data = []
    const data2 = []
    for (let i = 0; i < light.length; i++) {
      data.push(light[i]);
      data2.push(i)
    }
    this.CreateLinarChart(data, data2)
  }

  SetCelciusAndHumidity(celciusdata, humiditydata){
    const data = []
    const data2 = []
    for (let i = 0; i < celciusdata.length ; i++) {
      data.push({x: i, y: celciusdata[i]});
      data2.push({x: i, y: humiditydata[i]});
    }
    this.CreateLinarProgressiveChart(data,data2)
  }
}
