export class Light{
    Value: number;
    LightIsOn: Boolean;
    
    constructor(value: number, lightIsOn: boolean){
        this.Value = value;
        this.LightIsOn = lightIsOn;
    }
}