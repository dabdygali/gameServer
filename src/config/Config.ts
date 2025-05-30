import dotenv from 'dotenv';

dotenv.config();

export default class Config {
    public readonly radishHost:string;
    public readonly radishPort:number;
    public readonly port:number;

    constructor() {
        this.radishHost = process.env.RADISH_HOST || "localhost";
        this.radishPort = parseInt(process.env.RADISH_PORT || "") || 5100;
        this.port = parseInt(process.env.PORT || "") || 5002
    }
}