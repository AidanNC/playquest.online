import * as db_methods from "../db_methods.ts";
import Game from "../../gameEngine/GameManager.ts";
import fs from 'fs'; 

export async function SaveGame(inGameIDs: string[], game: Game){
	if(!game.gameOver){
		console.error("Game is not over");
		return;
	}
	console.log("getUsers");
	const users = await db_methods.getUsers();
	console.log(users);
	console.log("overridding and saving game even though its not over");
	const now = Date.now();
	const gameLocation = './gameLogs/' + now + '.txt'; 
	await db_methods.InsertGame(now, gameLocation ); 
	const sql_game = await db_methods.getGameByDate(now);
	const gameID = sql_game.gid;
	//add the players to the player game table:
	for(let i = 0; i < inGameIDs.length; i++){
		const result = await db_methods.getUserByInGameID(inGameIDs[i]);
		if(!result){
			console.error("Not saving info for player " + inGameIDs[i]);
		}else{
			db_methods.InsertPlayerGame(result.id, gameID, game.scores[i], i); //i is the index of the player in the game
		}
	}
	//save the actual game 
	const record = game.getGameRecorder().toString();
	fs.writeFile(gameLocation, record, (err) => {
		if (err) {
		  console.error('Error writing game record to file:', err);
		} else {
		  console.log('Game record saved to file successfully.');
		}
	 });

}