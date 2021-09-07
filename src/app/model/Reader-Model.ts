export class Reader{
    RoomId: string;
    Time: Date;
    Humidity: number;
    Temperature: number;
    Light: number;
    IsLightOn: boolean;
    
    constructor(roomId:string, time:Date, humidity:number, temperature:number, light:number, islighton:boolean){
        this.RoomId = roomId;
        this.Time = time;
        this.Humidity = humidity;
        this.Temperature = temperature;
        this.Light = light;
        this.IsLightOn = islighton;
    }
}