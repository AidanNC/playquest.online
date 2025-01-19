import Card from "./Card";
import Game from "./GameManager";
//the game recorder class will just record thegame, something else should associate player indexes with the player who was playing

/*
every game will start with the number 99 
the numbers 98 - 90 are reserved for future use and will be skipped in the parser until meaning is defined
important: ** each number is 2 digits long, so if a number is less than 10 it will have a leading 0 **
the whole game can be represented by a sequence of numbers, 
the first number is the number of players, 
second number is starting hand size, usually this will be 10 but including it in the standard just in case 
third number is initial dealer index
after these firsts 3 numbers we will have all the different round of the game: 
the trump card
the hands of each player listed in order of player index
the list of actions that are taken by the players, there should be n * (h+1) actions 
where n is the number of players and h is the starting hand size
*/

//
class GameRecorder {
	gameRecord: string;
	constructor(playerCount: number, handSize: number, dealerIndex: number) {
		this.gameRecord =
			"99" + this.digitString_array([playerCount, handSize, dealerIndex]);
	}
	digitString(num: number): string {
		return num < 10 ? "0" + num : num.toString();
	}
	digitString_array(arr: number[]): string {
		return arr.map((num) => this.digitString(num)).join("");
	}
	startRound(trumpCard: Card, playerHands: Card[][]) {
		this.gameRecord += this.digitString(trumpCard.getNumericValue());
		playerHands.forEach((hand) => {
			this.gameRecord += hand
				.map((card) => this.digitString(card.getNumericValue()))
				.join("");
		});
	}
	addAction(action: number) {
		this.gameRecord += this.digitString(action);
	}
	toString(): string {
		return this.gameRecord;
	}
	pprint() {
		for (let i = 0; i < this.gameRecord.length; i += 2) {
			console.log(this.gameRecord.slice(i, i + 2));
		}
	}
	readableMeaning(){
		return GameRecorder.getInfo(this.gameRecord).explanations;
	}
	static getInfo(gameString: string) {
		//first parse into array of strings
		const gameRecord =  gameString ;
		const strArr: string[] = [];
		for (let i = 0; i < gameRecord.length; i += 2) {
			strArr.push(gameRecord.slice(i, i + 2));
		}
		const explanations: string[] = [];
		//this is for replaying the game
		const playerHands: Card[] = [];
		const actions: number[] = [];
		const trumpCards: Card[] = []; //--
		let initialDealerIndex = -1; //--
		// info index
		let infoIndex = 0;
		let nextRoundStart = 3;
		let currentRoundStart = -1;
		let numPlayers = -1;
		let handSize = -1;
		let prevHandSize = 100;
		let actionCount = 0;
		// let dealerIndex = -1;
		for (let i = 0; i < strArr.length; i++) {
			let str = strArr[i];
			if (parseInt(str) > 89) {
				if (str === "99") {
					str += " gameStart flag";
				} else {
					str += " reserved for future use";
				}
			} else {
				//here will be actual info pertaining to the game
				str += " : ";
				if (infoIndex === 0) {
					// its the start of a round
					str += "number of players: ";
					numPlayers = parseInt(str);
				} else if (infoIndex === 1) {
					str += "starting hand size: ";
					// prevHandSize = handSize;
					handSize = parseInt(str) + 1; //becuase we will be decrementing it immeitdaly after
				} else if (infoIndex === 2) {
					str += "dealer index: ";
					initialDealerIndex = parseInt(str);
					// dealerIndex = parseInt(str);
				} else if (infoIndex === nextRoundStart) {
					//this is where we decrement the handSize
					currentRoundStart = nextRoundStart;
					if (handSize > prevHandSize || handSize === 1) {
						prevHandSize = handSize;
						handSize++;
					} else if (handSize < prevHandSize) {
						prevHandSize = handSize;
						handSize--;
					}
					actionCount = 0;
					str += "trump card";
					nextRoundStart += numPlayers * (handSize + 1); // number of actions
					nextRoundStart += numPlayers * handSize; //contents of the handds
					nextRoundStart += 1; //trump card
					trumpCards.push(Card.fromNumericValue(parseInt(str)));
				} else if (infoIndex <= currentRoundStart + numPlayers * handSize) {
					//this means we are looking at the hands
					str +=
						"player " +
						Math.floor((infoIndex - currentRoundStart - 1) / handSize) +
						" hand";
					playerHands.push(Card.fromNumericValue(parseInt(str)));
				} else {
					str += "action " + actionCount++;
					actions.push(parseInt(str));
				}

				//we parsed some game info so increment the info index
				infoIndex++;
			}

			explanations.push(str);
		}
		return {explanations, playerHands, actions, trumpCards, initialDealerIndex, numPlayers};
	}
	static replayGame(gameString: string){
		//basic stats implementation
		const info = this.getInfo(gameString);
		const game = new Game(info.numPlayers, info.playerHands, info.trumpCards);
		game.startRound(10, info.initialDealerIndex);
		for(const action of info.actions){
			game.processAction(game.activePlayer, action);
		}
		return game.scores;
	}
	static getHighScore(playerIndex: number, gameString: string): number{
		const scores = GameRecorder.replayGame(gameString);
		if(playerIndex < 0 || playerIndex >= scores.length){
			console.error("player index out of range, returning -1");
			return -1;
		}else{
			return scores[playerIndex];
		}
	}
}

type Naive_GameState = {
	round: number;
	playerHands: Card[][];
	dealerIndex: number;
	playerActions: number[]; //inludes bets and then cards played
	trunpCard: Card;
};

class Naive_GameRecorder {
	stateList: Naive_GameState[] = [];
	currentState!: Naive_GameState;
	playerCount: number;

	constructor(
		playerCount: number,
		playerHands: Card[][],
		dealerIndex: number,
		trumpCard: Card
	) {
		this.playerCount = playerCount;
		this.newRound(0, playerHands, dealerIndex, trumpCard);
	}

	newRound(
		round: number,
		playerHands: Card[][],
		dealerIndex: number,
		trumpCard: Card
	) {
		this.endRound();
		this.currentState = {
			round: round,
			playerHands: playerHands,
			dealerIndex: dealerIndex,
			playerActions: [],
			trunpCard: trumpCard,
		};
	}

	addAction(action: number) {
		this.currentState.playerActions.push(action);
	}

	endRound() {
		if (this.currentState) {
			this.stateList.push(this.currentState);
		}
	}
}

export { GameRecorder, Naive_GameRecorder };
export type { Naive_GameState };
