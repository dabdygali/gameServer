response=$(curl -X POST localhost:5002/game/internal/match -H "Content-Type: application/json" -d '{"id" : 1, "players": [1, 2]}')
echo "Response: $response"