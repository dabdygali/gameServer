import Client from "../pkg/ws/client";

export default class User {
	public readonly id: number;
	public			client: Client | null = null;

	public constructor(id: number) {
		this.id = id;
		this.client = null;
	}
}
