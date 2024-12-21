import Game from "./GameManager";
import PlayerInfo, {deserializePlayerInfo} from "./PlayerInfo";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function playGame(
	playerCount: number,
	startingRound: number = 10,
	delay: number = 1000,
	stateSetter: (state: any) => void | null
) {
	const game = new Game(playerCount);
	game.startRound(startingRound, 0);
	while (!game.gameOver) {
		game.processAction(
			game.activePlayer,
			game.getRandomPlay(game.activePlayer)
		); // make a random move
		if (stateSetter) {
			stateSetter(game.generateInfo(0));
		}
		await sleep(delay);
	}
}

export function GetWholeGameInfo(playerCount: number, inputGame: Game | null = null) : PlayerInfo[]{
	const game = inputGame ? inputGame : new Game(playerCount);
	game.startRound(10, 0);
	let info: PlayerInfo[] = [];
	while (!game.gameOver) {
		game.processAction(
			game.activePlayer,
			game.getRandomPlay(game.activePlayer)
		); // make a random move
		const temp = game.generateInfo(0);
		game.clearActionQueue();
		if(temp !== -1){
			// info.push(temp);
			info.push(deserializePlayerInfo(JSON.parse(JSON.stringify(temp))));
		}
	}
	return info;
}