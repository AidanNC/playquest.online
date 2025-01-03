import WebSocket, { WebSocketServer } from "ws";
import Game from "../gameEngine/GameManager";
import cookie from "cookie";
import { SaveGame } from "./stats/utils";

export default function HostGame(
	port: number,
	maxPlayers: number,
	botCount: number,
	portFreed: () => void,
	verifyToken: (token: string) => [string, string] | undefined
) {
	let finishedGame = false;
	function finishGame(game: Game, playerIDs: string[]) {
		if(finishedGame){
			return;
		}
		console.log("WSS GAME OVER");
		console.log("SAVING GAME");
		finishedGame = true;
		SaveGame(playerIDs, game);
	}
	const wss = new WebSocketServer({ port: port });
	const tenMinutes = 600000;
	const tenHours = 36000000;
	function checkEndGame() {
		console.log("Checking if game should end");
		setTimeout(() => {
			if (activePlayerCount === 0) {
				wss.close();
				portFreed();
			}
		}, tenHours);
	}
	checkEndGame();

	console.log(`Starting WSS Server! Port: ${port}`);
	let activePlayerCount = 0;
	let playerCount = 0;
	const MAX_PLAYERS = maxPlayers;

	const playerIDs: string[] = [];
	const playerNames: string[] = [];
	const imageStrings: string[] = [];
	const sockets: (WebSocket | null)[] = [];

	//initialize the bots:
	for (let i = 0; i < botCount; i++) {
		playerCount++;
		playerIDs.push("bot0ge" + i);
		playerNames.push("bot0ge" + i);
		imageStrings.push("stone");
		sockets.push(null);
	}
	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const makeBotPlays = async () => {
		console.log("Making bot plays");
		console.log(game.activePlayer);
		console.log(botCount);
		while (game.activePlayer < botCount) {
			//bot count is 1 indexed, pID is 0 indexed
			console.log(playerNames[game.activePlayer] + " is playing");
			game.clearActionQueue(); //make sure the action queue is cleared
			game.processAction(
				game.activePlayer,
				game.getRandomPlay(game.activePlayer)
			);
			if (game.gameOver) {
				finishGame(game, playerIDs);
			}
			await sleep(1000);
			//send out the info the the players
			sockets.forEach(function each(client) {
				getAndSendInfo(client);
			});
		}
	};
	//basic gameplay
	const game = new Game(MAX_PLAYERS);
	game.startRound(10, 0);

	const streamLinedSendInfo = (client: WebSocket) => {
		if (playerCount === MAX_PLAYERS) {
			getAndSendInfo(client);
		} else {
			sendMetaInfo(client);
		}
	};

	function getAndSendInfo(client: WebSocket | null) {
		if (client === null) {
			return;
		}
		const gameInfo = game.generateInfo(sockets.indexOf(client));
		const metaInfo = {
			playerNames: playerNames,
			imageStrings: imageStrings,
		};
		const message = JSON.stringify({
			playerInfo: gameInfo,
			metaInfo: metaInfo,
		});
		// console.log("sending");
		// console.log(gameInfo !== -1 ? gameInfo.timeStep : "no info");
		client.send(message);
	}
	const sendMetaInfo = (client: WebSocket | null) => {
		if (client === null) {
			return;
		}
		const metaInfo = {
			playerNames: playerNames,
			imageStrings: imageStrings,
		};
		const message = JSON.stringify({
			metaInfo: metaInfo,
		});
		// console.log("sending metainfo");
		client.send(message);
	};

	wss.on("connection", function connection(ws, req) {
		ws.on("error", console.error);
		const cookies = cookie.parse(req.headers.cookie || "");
		console.log("wss cookies");
		console.log("Cookies:", cookies);
		let playerID: string;
		const token = cookies.token;

		if (token) {
			const user = verifyToken(token);
			if (user && !playerIDs.includes(user[1])) {
				playerIDs.push(user[1]);
				playerID = user[1];
				playerNames.push(user[0]);
				sockets.push(ws);
				imageStrings.push("beanbag");
				playerCount++;
				console.log("a verified user has connected");
				if (playerCount === MAX_PLAYERS) {
					// getAndSendInfo(ws);
					makeBotPlays(); //now that everyone has joined have the bots play
					sockets.forEach(function each(client) {
						getAndSendInfo(client);
					});
				}
			}
			if(user && playerIDs.includes(user[1])){
				playerID = user[1];
				console.log("a verified user has reconnected");
			}
		}

		ws.on("message", function message(data) {
			// console.log(data.toString());
			const jsonData = JSON.parse(data.toString());
			playerID = playerID ? playerID : jsonData.id;
			//handle pings
			if (
				jsonData.ping !== undefined &&
				playerID !== undefined &&
				playerIDs.includes(playerID)
			) {
				const pingMessage = JSON.stringify({
					ping: true,
					sentTime: jsonData.sentTime,
				});
				ws.send(pingMessage);
				streamLinedSendInfo(ws);
			}
			if (jsonData.join !== undefined && playerID !== undefined) {
				//player isn't in the game and there is room, let them join
				if (playerCount < MAX_PLAYERS && !playerIDs.includes(playerID)) {
					playerCount++;
					activePlayerCount++;
					sockets.push(ws);
					playerIDs.push(playerID);
					playerNames.push(jsonData.name); //just assume these fields are populated
					imageStrings.push(jsonData.imageString);
					if (playerCount === MAX_PLAYERS) {
						// getAndSendInfo(ws);
						makeBotPlays(); //now that everyone has joined have the bots play
						sockets.forEach(function each(client) {
							getAndSendInfo(client);
						});
					}
					//update the other players on the opponents info
					sockets.forEach(function each(client) {
						sendMetaInfo(client);
					});
				} else if (playerIDs.includes(playerID)) {
					const pindex = playerIDs.indexOf(playerID);
					sockets[pindex] = ws;
					console.log(jsonData.imageString);
					if(jsonData.imageString !== undefined){
						imageStrings[pindex] = jsonData.imageString;
					}
					activePlayerCount++;
					console.log(`Player ${jsonData.name} reconnected!`);
					sendMetaInfo(ws);
					if (playerCount === MAX_PLAYERS) {
						console.log(playerCount);
						getAndSendInfo(ws);
					}
				} else {
					console.log("Game full, join rejected!");
					console.log(playerIDs);
				}
			}
			if (jsonData.action !== undefined && playerIDs.includes(playerID)) {
				game.clearActionQueue();
				const playerIndex = sockets.indexOf(ws);
				const result = game.processAction(playerIndex, jsonData.action);
				if(game.gameOver){
					finishGame(game, playerIDs);
				}
				if (result === 1) {
					sockets.forEach(function each(client) {
						getAndSendInfo(client);
					});
					//after the player has played, lets check if the bots should play
					makeBotPlays();
				}
			}
		});
		ws.on("close", function close() {
			const index = sockets.indexOf(ws);
			console.log(`Player ${playerNames[index]} disconnected!`);
			activePlayerCount--;
			if (activePlayerCount === 0) {
				console.log("No players left, closing game!");
				checkEndGame();
			}
		});
	});
}
