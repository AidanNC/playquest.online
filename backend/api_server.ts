import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import HostGame from "./wss";
import * as db_methods from "./db_methods.ts";
import {
	hashPassword,
	verifyPassword,
	generateToken,
	verifyToken,
} from "./auth.ts";

//set up the server
const app = express();
const port = 4000;
let basePort = 8000;
const maxGames = 20;
let numGames = 0;

const availablePorts: number[] = Array.from({ length: 20 }, (_, i) => i + 1);

const corsOptions = {
	origin: "http://10.0.0.66:5173", // Allow all origins for testing purposes. Change this to your frontend domain in production.
	optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
	credentials: true,
};
// Use the cors middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

function portFreed(port: number) {
	numGames--;
	console.log(`Game on port ${port} has ended`);
	availablePorts.push(port);
}

app.get("/createGame", (req, res) => {
	console.log("api cookies");
	console.log("Cookies:", req.cookies);
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
	} else if (botCount < 0 || botCount > playerCount - 1) {
		//check for number of bots being valid
		res.status(400).send({ message: "Invalid number of bots" });
	} else {
		numGames++;
		// res.send({ message: "Game created", port: ++basePort });
		const wsport = availablePorts.shift();
		if (wsport === undefined) {
			//this shouldn't ever happen becaseu we are checking the number of games
			return;
		}
		res.send({ message: "Game created", port: basePort + wsport });
		console.log(`Game on port ${basePort + wsport} has started`);
		console.log(`Number of games: ${numGames}`);
		console.log("Available ports: ", availablePorts);
		HostGame(basePort + wsport, playerCount, botCount, () => {
			portFreed(wsport);
		});
	}
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await db_methods.getUserByUsername(username);
	if (user === undefined) {
		res.status(400).send({ message: "User not found" }); //should change to generic message
		//should tell them to login
		return;
	}else{
		const passhash = user.passhash;
		const isValid = await verifyPassword(password, passhash);
		if (!isValid) {
			res.status(401).send({ message: "Invalid password" }); //should change to generic message
			return;
		}
		//now we know the user exists and has provided the right password
		const token = await generateToken(username);
		res.cookie("token", token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), //expires in 7 days
		}); //set secure to tru in production
		res.json({ message: "Login Success" });
		console.log(username + " has logged in");
	}
});

app.post("/register", async (req, res) => {
	const { username, password, email } = req.body;
	const user = await db_methods.getUserByUsername(username);
	if (user !== undefined) {
		res.status(400).send({ message: "User already registered" }); //should change to generic message
		//should tell them to login
		return;
	}else{
		const passhash = await hashPassword(password);
		await db_methods.insertUser(username, passhash, email);
		res.json({ message: "Registration Success" });
	}
	
});


app.post("/testCookies", async (req, res) => {
	console.log("test cookies");
	console.log("Cookies:", req.cookies);
	res.json({messge: "cookies ogged"})
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
