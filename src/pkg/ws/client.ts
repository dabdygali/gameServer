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
    private conn:WebSocket;

    constructor(conn: WebSocket) {
        this.conn = conn;
    } 
    private send(message: string): void {
        if (this.conn.readyState === WebSocket.OPEN) {
            this.conn.send(message);
        }
    }

    public close(code: number = 1000, reason: string = ''): void {
        this.conn.close(code, reason);
    }
    
    public info(type:string, payload: any): void {
        this.send(JSON.stringify({
            type: type,
            payload: payload
        }));
    }
    
    public error(message: string): void {
        this.send(JSON.stringify({
            type: 'error',
            payload: message
        }));
    }
}