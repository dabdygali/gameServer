enum WS_SERVER {
    Error = 'error',

    // Authorization
    Authorized = 'authorized',
    Unauthorized = 'unauthorized',

    // Gameplay
    Sync = 'sync',
    MatchStart = 'match_start',
	MatchOver = 'match_over',
    MatchScoreUpdate = 'match_score_update',
    MatchOpponentConnected = 'match_opponent_connected',
    MatchOpponentDisconnected = 'match_opponent_disconnected',
    MatchOpponentReconnected = 'match_opponent_reconnected',
}

export default WS_SERVER;
