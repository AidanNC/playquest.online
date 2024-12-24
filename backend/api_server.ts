import express from "express";
import HostGame from "./wss";
const app = express();
const port = 4000;
let basePort = 8000;

const maxGames = 3;
let numGames = 0;

app.get("/createGame", (req, res) => {
	const playerCount = Number(req.query.numPlayers);
	console.log(`Creating game with ${playerCount} players`);

	if (playerCount < 2 || playerCount > 4) {
		res.status(400).send({ message: "Invalid number of players" });
		return;
	} else if (numGames >= maxGames) {
		res.status(400).send({ message: "Maximum number of games reached" });
		return;
	} else {
		numGames++;
		res.send({ message: "Game created", port: ++basePort });
		HostGame(basePort, playerCount);
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
