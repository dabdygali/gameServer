import dotenv from 'dotenv';

dotenv.config();

export default class Config {
    public readonly radishHost:string;
    public readonly radishPort:number;
    public readonly port:number;
    public readonly mode:string;
    public static readonly pointsToWin:number = parseInt(process.env.POINTS_TO_WIN || "") || 10;

    constructor() {
        this.radishHost = process.env.RADISH_HOST || "localhost";
        this.radishPort = parseInt(process.env.RADISH_PORT || "") || 5100;
        this.port = parseInt(process.env.PORT || "") || 5002
        this.mode = process.env.MODE || "development";
    }

    public get host(): string {
        if (this.mode === "production") {
            return "0.0.0.0";
        } 
        return "localhost";
    }
}