import WebSocket, { WebSocketServer } from "ws";
import Game from "../gameEngine/GameManager";

export default function HostGame(
	port: number,
	maxPlayers: number,
	botCount: number,
	portFreed: () => void
) {
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
	const MAX_PLAYERS = maxPlayers;

	const playerInfo = new PlayerInfoHolder();

	//initialize the bots:
	for (let i = 0; i < botCount; i++) {
		playerInfo.addPlayer("bot0ge" + i, "bot0ge" + i, "stone", i, null);
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
			console.log(playerInfo.getNameBy_gameID(game.activePlayer) + " is playing");
			game.clearActionQueue(); //make sure the action queue is cleared
			game.processAction(
				game.activePlayer,
				game.getRandomPlay(game.activePlayer)
			);
			await sleep(1000);
			//send out the info the the players
			playerInfo.getSockets().forEach(function each(client) {
				getAndSendInfo(client);
			});
		}
	};
	//basic gameplay
	const game = new Game(MAX_PLAYERS);
	game.startRound(10, 0);

	const streamLinedSendInfo = (client: WebSocket) => {
		if (playerInfo.getPlayerCount() === MAX_PLAYERS) {
			getAndSendInfo(client);
		} else {
			sendMetaInfo(client);
		}
	};

	function getAndSendInfo(client: WebSocket | null) {
		if (client === null) {
			return;
		}
		const gameInfo = game.generateInfo(playerInfo.getGameID_ws(client));
		const metaInfo = playerInfo.getMetaInfo();
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
		const metaInfo = playerInfo.getMetaInfo();
		const message = JSON.stringify({
			metaInfo: metaInfo,
		});
		// console.log("sending metainfo");
		client.send(message);
	};

	wss.on("connection", function connection(ws) {
		ws.on("error", console.error);

		ws.on("message", function message(data) {
			// console.log(data.toString());
			const jsonData = JSON.parse(data.toString());
			//handle pings
			if (
				jsonData.ping !== undefined &&
				jsonData.id !== undefined &&
				playerInfo.getPlayerIDs().includes(jsonData.id)
			) {
				const pingMessage = JSON.stringify({
					ping: true,
					sentTime: jsonData.sentTime,
				});
				ws.send(pingMessage);
				streamLinedSendInfo(ws);
			}
			if (jsonData.join !== undefined && jsonData.id !== undefined) {
				//player isn't in the game and there is room, let them join
				if (playerInfo.getPlayerCount() < MAX_PLAYERS && !playerInfo.getPlayerIDs().includes(jsonData.id)) {
					activePlayerCount++;
					playerInfo.addPlayer(jsonData.id, jsonData.name, jsonData.imageString, playerInfo.getPlayerCount() - 1, ws);
					if (playerInfo.getPlayerCount() === MAX_PLAYERS) {
						// getAndSendInfo(ws);
						makeBotPlays(); //now that everyone has joined have the bots play
						playerInfo.getSockets().forEach(function each(client) {
							getAndSendInfo(client);
						});
					}
					//update the other players on the opponents info
					playerInfo.getSockets().forEach(function each(client) {
						sendMetaInfo(client);
					});
				} else if (playerInfo.getPlayerIDs().includes(jsonData.id)) {
					playerInfo.setWsByPlayerID(jsonData.id, ws);
					activePlayerCount++;
					console.log(`Player ${jsonData.name} reconnected!`);
					sendMetaInfo(ws);
					if (playerInfo.getPlayerCount() === MAX_PLAYERS) {
						// console.log(playerCount);
						getAndSendInfo(ws);
					}
				} else {
					console.log("Game full, join rejected!");
					console.log(playerInfo.getPlayerIDs());
				}
			}
			if (jsonData.action !== undefined && playerInfo.getPlayerIDs().includes(jsonData.id)) {
				game.clearActionQueue();
				const playerGameID = playerInfo.getGameID_ws(ws);
				const result = game.processAction(playerGameID, jsonData.action);
				if (result === 1) {
					playerInfo.getSockets().forEach(function each(client) {
						getAndSendInfo(client);
					});
					//after the player has played, lets check if the bots should play
					makeBotPlays();
				}
			}
		});
		ws.on("close", function close() {
			const playerName = playerInfo.getNameBy_ws(ws);
			console.log(`Player ${playerName} disconnected!`);
			activePlayerCount--;
			if (activePlayerCount === 0) {
				console.log("No players left, closing game!");
				checkEndGame();
			}
		});
	});
}

function Host1Game(maxPlayers: number, botCount: number) {
	
}

class PlayerInfoHolder {
	playerIDs: string[] = [];
	playerNames: string[] = [];
	imageStrings: string[] = [];
	gameIDs: number[] = [];
	sockets: (WebSocket | null)[] = [];
	playerCount: number = 0;

	constructor(){}

	addPlayer(playerID: string, playerName: string, imageString: string, gameID: number, ws: WebSocket|null){
		this.playerIDs.push(playerID);
		this.playerNames.push(playerName);
		this.imageStrings.push(imageString);
		this.gameIDs.push(gameID);
		this.sockets.push(ws);
		this.playerCount++;
	}

	getGameID_playerID(playerID: string){
		return this.gameIDs[this.playerIDs.indexOf(playerID)];
	}

	getGameID_ws(ws: WebSocket){
		return this.gameIDs[this.sockets.indexOf(ws)];
	}
	getNameBy_gameID(gameID: number){
		return this.playerNames[this.gameIDs.indexOf(gameID)];
	}
	getNameBy_ws(ws: WebSocket){
		return this.playerNames[this.sockets.indexOf(ws)];
	}
	getSockets(){
		return this.sockets;
	}
	getMetaInfo(){
		return {
			playerNames: this.playerNames,
			imageStrings: this.imageStrings,
		}
	}
	getPlayerIDs(){
		return this.playerIDs;
	}
	setWsByPlayerID(playerID: string, ws: WebSocket){
		this.sockets[this.playerIDs.indexOf(playerID)] = ws;
	}
	getPlayerCount(){
		return this.playerCount;
	}
}
