import { GetWholeGameInfo } from "./GameTest";
import Game from "./GameManager";
import PlayerInfo, {deserializePlayerInfo} from "./PlayerInfo";
import GameActionMachine from "./GameAction";
import fs from 'fs';

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
// game.startRound(10, 0);
GetWholeGameInfo(10, game);

// game.getNaiveGameRecorder().stateList.forEach((state) => {console.log(state)});

console.log(game.getGameRecorder().toString());

const record = game.getGameRecorder().toString();
const filePath = './gameRecord.txt';
fs.writeFile(filePath, record, (err) => {
	if (err) {
	  console.error('Error writing to file:', err);
	} else {
	  console.log('String saved to file successfully.');
	}
  });
// game.getGameRecorder().pprint();
// game.getGameRecorder().readableMeaning().forEach((str) => console.log(str));

// const info = GetWholeGameInfo(3, game);


