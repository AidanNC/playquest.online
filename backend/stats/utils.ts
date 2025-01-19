import * as db_methods from "../db_methods.ts";
import Game from "../../gameEngine/GameManager.ts";
import { GameRecorder } from "../../gameEngine/GameRecorder.ts";
import fs from "fs";

export async function SaveGame(inGameIDs: string[], game: Game) {
	if (!game.gameOver) {
		console.error("Game is not over");
		return;
	}
	const now = Date.now();
	const gameLocation = "./gameLogs/" + now + ".txt";
	await db_methods.InsertGame(now, gameLocation);
	const sql_game = await db_methods.getGameByDate(now);
	const gameID = sql_game.gid;
	//add the players to the player game table:
	for (let i = 0; i < inGameIDs.length; i++) {
		const result = await db_methods.getUserByInGameID(inGameIDs[i]);
		if (!result) {
			console.error("Not saving info for player " + inGameIDs[i]);
		} else {
			db_methods.InsertPlayerGame(result.id, gameID, game.scores[i], i); //i is the index of the player in the game
		}
	}
	//save the actual game
	const record = game.getGameRecorder().toString();
	console.log("game record: ");
	console.log(record);
	fs.writeFile(gameLocation, record, (err) => {
		if (err) {
			console.error("Error writing game record to file:", err);
		} else {
			console.log("Game record saved to file successfully.");
		}
	});
}

export async function getStats(username: string) {
	const db = await db_methods.openDb();
	const user = await db.get("SELECT * FROM users WHERE username = ?", [
		username,
	]);
	if (user === undefined) {
		return undefined;
	}
	const gameNames = await db.all(
		"SELECT games.gameLocation, playerGame.gameIndex FROM playerGame JOIN games ON playerGame.gid = games.gid WHERE playerGame.pid = ?",
		[user.id]
	);
	const scores: number[] = [];
	await Promise.all(
		gameNames.map(async (game) => {
			return new Promise<void>((resolve, reject) => {
				fs.readFile(game.gameLocation, (err, data) => {
					if (err) {
						console.error("Error reading file: ", err);
						reject(err);
						return;
					}
					const gameRecord = data.toString();
					const highScore = GameRecorder.getHighScore(
						game.gameIndex,
						gameRecord
					);
					scores.push(highScore);
					resolve();
				});
			});
		})
	);
	return {
		highScore: Math.max(...scores),
		averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
	};
}
