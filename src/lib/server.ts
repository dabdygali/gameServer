import Match from "./match"
import Fastify, { fastify, FastifyInstance } from "fastify"

const PORT: number = 80;

export default class Server {
	// static #instance: Server;
	static readonly #fastify: FastifyInstance = fastify();
	static readonly #isInternalConstructing: boolean = false;

	static #matches:Array<Match> = [];
	static #keys:Map<Match, Map<number, string>> = new Map<Match, Map<number, string>>();
	static #participants:Map<string, Match> = new Map<string, Match>();

	private constructor() {
		throw new TypeError("Server is not constructable");
	}

	// static #createInstance() :void {
	// 	if (Server.#instance)
	// 		return;
	// 	Server.#isInternalConstructing = true;
	// 	Server.#instance = new Server();
	// 	Server.#isInternalConstructing = false;
	// 	return;
	// }

	public static listen(port:number = PORT){
	}

	// static {
	// 	Server.#createInstance();
	// }
}
