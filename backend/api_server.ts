import express from "express";
import cors from "cors"; 
import HostGame from "./wss";
import * as db_methods from "./db_methods.ts";

//set up the server
const app = express();
const port = 4000;
let basePort = 8000;
const maxGames = 20;
let numGames = 0;

const availablePorts: number[] = Array.from({ length: 20 }, (_, i) => i + 1);

const corsOptions = {
    origin: "*", // Allow all origins for testing purposes. Change this to your frontend domain in production.
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
// Use the cors middleware
app.use(cors(corsOptions));

function portFreed(port:number){
	numGames--;
	console.log(`Game on port ${port} has ended`);
	availablePorts.push(port);
}

app.get("/createGame", (req, res) => {
	const playerCount = Number(req.query.numPlayers);
	const botCount = Number(req.query.botCount);
	
	console.log(`Creating game with ${playerCount} players`);
	console.log(`Creating game with ${botCount} bots`);

	if (playerCount < 2 || playerCount > 5) {
		res.status(400).send({ message: "Invalid number of players" });
		return;
	} else if (numGames >= maxGames) {
		res.status(400).send({ message: "Maximum number of games reached" });
		return;
	}else if(botCount < 0 || botCount > playerCount - 1){
		//check for number of bots being valid
		res.status(400).send({message: "Invalid number of bots"});

	}else {
		numGames++;
		// res.send({ message: "Game created", port: ++basePort });
		const wsport = availablePorts.shift();
		if(wsport === undefined){ //this shouldn't ever happen becaseu we are checking the number of games
			return;
		}
		res.send({ message: "Game created", port: basePort+wsport });
		HostGame(basePort+wsport, playerCount, botCount, ()=>{portFreed(wsport)});
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
