# Game Host

This folder should contain the logic that drives the game.

- The host determines the room id. Clients join the room.
- The host sets the game state at any given moment, and is reponsible to broadcast it to clients.
- Clients can make requests. The host determines if they are valid. The event might change state, which the host will then broadcast.
