enum WS_SERVER {
    // Authorization
    Authorized = 'authorized',
    Unauthorized = 'unauthorized',

    // Gameplay
    Sync = 'sync',
    MatchStart = 'match_start',
    MatchOpponentConnected = 'match_opponent_connected',
    MatchOpponentDisconnected = 'match_opponent_disconnected',
    MatchOpponentReconnected = 'match_opponent_reconnected',
}

export default WS_SERVER;