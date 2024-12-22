import express from "express";
import HostGame from "./wss";
const app = express();
const port = 4000;
let basePort = 8000;
app.get("/createGame", (req, res) => {
	const playerCount = Number(req.query.numPlayers);
	console.log(`Creating game with ${playerCount} players`);
	res.send({message: "Game created", port: ++basePort});
	HostGame(basePort, playerCount);
});

// app.post('/api/data', (req, res) => {
// 	const data = req.body;
// 	res.json({ receivedData: data });
//   });

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});