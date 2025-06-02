import Match from "./match"
import Fastify, { fastify, FastifyInstance } from "fastify"

export default class Server {
	static readonly #isInternalConstructing: boolean = false;

	static #matches:Array<Match> = [];
	static #participants:Map<number, Match> = new Map<number, Match>();

	private constructor() {
		throw new TypeError("Server is not constructable");
	}

	public static createMatch(id: number, player1: number, player2: number) {
		if (Server.#matches.find(match => match.id === id))
			throw new Error(`Match with ID ${id} already exists`);
		Server.#matches.concat(new Match(id, player1, player2));
	}

	public static deleteMatch(id: number) {
		const index: number = Server.#matches.findIndex(match => match.id === id);
		if (index < 0)
			throw new Error(`Match with ID ${id} is not found`);
		Server.#matches.splice(index, 1);
	}
}
