import Client from "../../pkg/ws/client";
import syncData from "./serverSideHandlers/syncData";

const playerSpeed = 0.5

let direction1 = 0
let direction2 = 0

class ExampleMatch {
    private player1Pos: number;
    private player2Pos: number;
    private ballX: number;
    private ballY: number;

    private clients:Array<Client> = [];
    private updateInterval: NodeJS.Timeout | null = null;
    private calcInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.player1Pos = 0;
        this.player2Pos = 0;
        this.ballX = 0;
        this.ballY = 0;
        
        this.updateInterval = setInterval(() => {
            this.updator();
        }, 500)
        this.calcInterval = setInterval(() => {
            this.changer();
        }, 10)
    }

    public stop(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.calcInterval) {
            clearInterval(this.calcInterval);
            this.calcInterval = null;
        }
    }

    public addClient(client: Client): void {
        this.clients.push(client);

        console.log(`Client ${client.id} added to the match.`);

        // Send the current state to the new client
        syncData(client, this.currentState());
    }

    private changer() {
        if (this.player1Pos > 100) {
            direction1 = -1;
        } else if (this.player1Pos <= 0) {
            direction1 = 1;
        }
        if (this.player2Pos > 100) {
            direction2 = -1;
        } else if (this.player2Pos <= 0) {
            direction2 = 1;
        }

        this.player1Pos += playerSpeed * direction1;
        this.player2Pos += playerSpeed * direction2;
    }

    private updator() {
        const state = this.currentState()

        this.clients.forEach((client) => syncData(client, state))
    }

    public currentState(): { player1Pos: number; player2Pos: number; ballX: number; ballY: number } {
        return {
            player1Pos: this.player1Pos,
            player2Pos: this.player2Pos,
            ballX: this.ballX,
            ballY: this.ballY,
        };
    }
}

const example = new ExampleMatch()

export default example;