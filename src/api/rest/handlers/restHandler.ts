import { FastifyRequest, FastifyReply } from 'fastify'
import Server from '../../../lib/server'
import { error } from 'console';

type matchCreateBody = {
	id:number,
	players: Array<number>,
}

export async function restHandler(request: FastifyRequest, reply: FastifyReply) {
	const body = request.body as matchCreateBody;
	const matchID:number = body.id;
	if (typeof matchID !== 'number' || Number.isNaN(matchID) || !Number.isFinite(matchID)) {
		reply.code(400).send({ error: 'Invalid match ID. It must be a number.'});
		return;
	}

	const player1: number = body.players[0];
	if (typeof player1 !== 'number' || Number.isNaN(player1) || !Number.isFinite(player1)) {
		reply.code(400).send({ error: 'Invalid player1 ID. It must be a number.'});
		return;
	}

	const player2: number = body.players[1];
	if (typeof player2 !== 'number' || Number.isNaN(player2) || !Number.isFinite(player2)) {
		reply.code(400).send({ error: 'Invalid player2 ID. It must be a number.'});
		return;
	}
	
	try {
		Server.createMatch(matchID, player1, player2);
	} catch (e) {
		reply.code(400).send(e);
		return;
	}
	reply.code(200).send();
	return;
}
