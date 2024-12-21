import { GetWholeGameInfo } from "./GameTest";
import Game from "./GameManager";
import PlayerInfo, {deserializePlayerInfo} from "./PlayerInfo";
import GameActionMachine from "./GameAction";

// const info = GetWholeGameInfo(3);

// console.log(info.length);

// let nonEmptyHandCount = 0;
// for(let i = 0; i < info.length; i++){
// 	if(info[i].hand.length > 0){
// 		nonEmptyHandCount++;
// 	}
// }

// console.log(nonEmptyHandCount);

// const game = new Game(3);
// game.startRound(10, 0);
// let info: PlayerInfo[] = [];
// const dex1 = 10;
// const dex2 = 30;
// const dex3 = 120;
// const indexes = [dex1, dex2, dex3];
// while (!game.gameOver) {
// 	game.processAction(game.activePlayer, game.getRandomPlay(game.activePlayer)); // make a random move
// 	const temp = game.generateInfo(0);
// 	if (temp !== -1) {
// 		// const tempStr = JSON.stringify(temp);
// 		// console.log(tempStr);
// 		// const tempObj = JSON.parse(tempStr);
// 		console.log(temp.actionQueue);
// 		info.push(deserializePlayerInfo(JSON.parse(JSON.stringify(temp))));
// 	}
	
// }

// let nonEmptyHandCount = 0;
// for(let i = 0; i < info.length; i++){
// 	if(info[i].hand.length > 0){
// 		nonEmptyHandCount++;
// 	}
// }

// console.log(nonEmptyHandCount);

// for(let i = 10; i < 30; i++){
// 	console.log(info[i].actionQueue);
// }


// const tester = [
// 	{
// 	  pID: 1,
// 	  card: {
// 		suit: "S",
// 		value: 10,
// 		name: "10",
// 	  },
// 	  name: "playCardAction",
// 	}
//   ]

// console.log(GameActionMachine.deserialzeGameAction(tester[0]));


const game = new Game(3);
game.startRound(10, 0);

const info = GetWholeGameInfo(3, game);

console.log("*****************************");
for(let i = 0; i < game.scoreRecord.length; i++){
	console.log("Bets: " + game.betsRecord[i]);
	console.log("Scores: " + game.scoreRecord[i]);
}