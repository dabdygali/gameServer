import { FastifyRequest, FastifyReply } from 'fastify'
import Server from '../../../lib/server'
import { error } from 'console';

type matchCreateBody = {
	id:number,
	players: Array<number>,
	mode:number,
}

export async function restHandler(request: FastifyRequest, reply: FastifyReply) {
	const body = request.body as matchCreateBody;
	console.log("restHandler body", body);
	const matchId:number = body.id;
	if (typeof matchId !== 'number' || Number.isNaN(matchId) || !Number.isFinite(matchId)) {
		reply.code(400).send({ error: 'Invalid match ID. It must be a number.'});
		return;
	}

	const user1Id: number = body.players[0];
	if (typeof user1Id !== 'number' || Number.isNaN(user1Id) || !Number.isFinite(user1Id)) {
		reply.code(400).send({ error: 'Invalid user1Id ID. It must be a number.'});
		return;
	}

	const user2Id: number = body.players[1];
	if (typeof user2Id !== 'number' || Number.isNaN(user2Id) || !Number.isFinite(user2Id)) {
		reply.code(400).send({ error: 'Invalid user2Id ID. It must be a number.'});
		return;
	}

	const mode:number = body.mode;
	if (typeof mode !== 'number' || Number.isNaN(mode) || !Number.isFinite(mode) || (mode != 1 && mode != 2)) {
		reply.code(400).send({ error: 'Invalid mode. It must be a number.'});
		return;
	}
	
	try {
		Server.createMatch(matchId, user1Id, user2Id, mode);
	} catch (e) {
		reply.code(400).send(e);
		return;
	}
	reply.code(200).send();
	return;
}
