export class Reader{
    Id: number;
    Time: Date;
    Humidity: number;
    Temperature: number;
    Light: number;
    IsLightOn: boolean;
    
    constructor(id:number, time:Date,humidity:number, temperature:number, light:number, islighton:boolean){
        this.Id = id;
        this.Time = time;
        this.Humidity = humidity;
        this.Temperature = temperature;
        this.Light = light;
        this.IsLightOn = islighton;
    }
}