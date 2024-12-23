import WebSocket, { WebSocketServer } from "ws";
import Game from "../gameEngine/GameManager";

export default function HostGame(port: number, maxPlayers: number) {
	const wss = new WebSocketServer({ port: port });

	console.log(`Starting WSS Server! Port: ${port}`);
	let playerCount = 0;
	const MAX_PLAYERS = maxPlayers;

	const playerIDs: string[] = [];
	const playerNames: string[] = [];
	const imageStrings: string[] = [];
	const sockets: WebSocket[] = [];

	//basic gameplay
	const game = new Game(MAX_PLAYERS);
	game.startRound(10, 0);

	const getAndSendInfo = (client: WebSocket,) => {
		const gameInfo = game.generateInfo(sockets.indexOf(client));
		const metaInfo = {
			playerNames: playerNames,
			imageStrings: imageStrings,
		};
		const message = JSON.stringify({
			playerInfo: gameInfo,
			metaInfo: metaInfo,
		});
		console.log("sending");
		console.log(gameInfo !== -1 ? gameInfo.timeStep: "no info");
		client.send(message);
	};
	const sendMetaInfo = (client: WebSocket) => {
		const metaInfo = {
			playerNames: playerNames,
			imageStrings: imageStrings,
		};
		const message = JSON.stringify({
			metaInfo: metaInfo,
		});
		console.log("sending metainfo");
		client.send(message);
	};

	wss.on("connection", function connection(ws) {
		ws.on("error", console.error);

		ws.on("message", function message(data) {
			console.log(data.toString());
			const jsonData = JSON.parse(data.toString());
			if (jsonData.join !== undefined && jsonData.id !== undefined) {
				//player isn't in the game and there is room, let them join
				if (playerCount < MAX_PLAYERS && !playerIDs.includes(jsonData.id)) {
					playerCount++;
					sockets.push(ws);
					playerIDs.push(jsonData.id);
					playerNames.push(jsonData.name); //just assume these fields are populated
					imageStrings.push(jsonData.imageString);
					getAndSendInfo(ws);
					//update the other players on the opponents info
					sockets.forEach(function each(client) {
						sendMetaInfo(client);
					});
				} else if (playerIDs.includes(jsonData.id)) {
					const pindex = playerIDs.indexOf(jsonData.id);
					sockets[pindex] = ws;
					console.log(`Player ${jsonData.name} reconnected!`);
					getAndSendInfo(ws);
				} else {
					console.log("Game full, join rejected!");
					console.log(playerIDs);
				}
			}
			if (jsonData.action !== undefined && playerIDs.includes(jsonData.id)) {
				game.clearActionQueue();
				const playerIndex = sockets.indexOf(ws);
				const result = game.processAction(playerIndex, jsonData.action);
				if (result === 1) {
					sockets.forEach(function each(client) {
						getAndSendInfo(client);
					});
					// game.clearActionQueue();
				}
			}
		});
	});
}
