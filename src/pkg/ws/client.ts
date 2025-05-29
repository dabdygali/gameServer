import { WebSocket } from "@fastify/websocket";

function generator() {
    let id = 0;
    return {
        next: () => {
            id += 1;
            return id;
        }
    };
}

const clientIdGenerator = generator();

export default class Client {
    public id:number = clientIdGenerator.next();
    private userId:number|undefined
    private conn:WebSocket;

    constructor(conn: WebSocket) {
        this.conn = conn;
    } 

    public close(code: number = 1000, reason: string = ''): void {
        this.conn.close(code, reason);
    }
    
    public send(type:string, payload?: any): void {
        if (this.conn.readyState !== WebSocket.OPEN) {
            return ;
        }
        this.conn.send(JSON.stringify({
            type: type,
            payload: payload
        }));
    }
    
    public error(message: string): void {
        this.send("error", message)
    }

    public setUserId(id:number): void {
        if (this.userId === undefined) {
            this.userId = id;
        }
    }
}