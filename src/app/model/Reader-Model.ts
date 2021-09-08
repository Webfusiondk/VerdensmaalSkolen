import { Humidity } from "./Humidity";
import { Light } from "./Light";
import { Temperture } from "./Temperature";

export class Reader{
    RoomId: string;
    Time: Date;
    Humidity: Humidity;
    Temperature: Temperture;
    Light: Light;
    IsLightOn: boolean;
    
    constructor(roomId:string, time:Date, humidity:number, temperature:number, light:number, islighton:boolean){
        this.RoomId = roomId;
        this.Time = time;
        this.Humidity = new Humidity(humidity);
        this.Temperature = new Temperture(temperature);
        this.Light = new Light(light,islighton);
        this.IsLightOn = islighton;
    }
}