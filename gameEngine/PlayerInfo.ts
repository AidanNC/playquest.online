//This will just be a class definition file for the player info and the opponent info
import Card from "./Card";
import GameActionMachine, {GameAction} from "./GameAction";

export default interface PlayerInfo {
	hand: Card[];
	trumpCard: Card;
	playerBet: number;
	playerWonTricks: Card[][];
	currTrick: Card[];
	playerScore: number;
	active: boolean;
	playedCard: Card | null;
	opponents: OpponentInfo[];
	startingPlayer: number;
	timeStep: number;
	pID: number;
	actionQueue: GameAction[];
	scoreRecord: number[][];
	betsRecord: number[][];
}

export interface OpponentInfo {
	bet: number;
	wonTricks: Card[][];
	score: number;
	active: boolean;
	cardsInHand: number;
	playedCard: Card | null;
	pID: number;
}

//we have to trust that the data is in the correct format, will add error checking later
export const deserializePlayerInfo = (data: any): PlayerInfo => {
	const hand: Card[] = data.hand.map((card: Card) => {
		return new Card(card.suit, card.value);
	});
	const trumpCard: Card = new Card(data.trumpCard.suit, data.trumpCard.value);
	const playerBet: number = data.playerBet;
	const playerWonTricks: Card[][] = data.playerWonTricks.map((trick:Card[])=>{
		return trick.map((card:Card)=>{
			return new Card(card.suit, card.value);
		});
	}); //this might not work
	const currTrick: Card[] = data.currTrick.map((card: Card) => {
		return new Card(card.suit, card.value);
	});
	const playerScore: number = data.playerScore;
	const active: boolean = data.active;
	const playedCard: Card | null = data.playedCard === null ? null : new Card(
		data.playedCard.suit,
		data.playedCard.value
	);
	const opponents: OpponentInfo[] = data.opponents.map((oppInfo: OpponentInfo)=>{
		return deserializeOpponentInfo(oppInfo);
	}); // this wont work lol
	const startingPlayer: number = data.startingPlayer;
	const timeStep: number = data.timeStep;
	const pID = data.pID;
	// console.log(data.actionQueue);
	const actionQueue: GameAction[] = data.actionQueue.map((action: GameAction) => {
		return GameActionMachine.deserialzeGameAction(action);
	});
	// console.log(actionQueue);
	const scoreRecord: number[][] = data.scoreRecord;
	const betsRecord: number[][] = data.betsRecord;

	return {
		hand,
		trumpCard,
		playerBet,
		playerWonTricks,
		currTrick,
		playerScore,
		active,
		playedCard,
		opponents,
		startingPlayer,
		timeStep,
		pID,
		actionQueue,
		scoreRecord,
		betsRecord,
	};
};

const deserializeOpponentInfo = (data: any): OpponentInfo => {
	const bet: number = data.bet;
	const wonTricks: Card[][] = data.wonTricks.map((trick:Card[])=>{
		return trick.map((card:Card)=>{
			return new Card(card.suit, card.value);
		});
	}); //this might not work
	const score: number = data.score;
	const active: boolean = data.active;
	const playedCard: Card | null = data.playedCard === null ? null : new Card(
		data.playedCard.suit,
		data.playedCard.value
	);
	const cardsInHand: number = data.cardsInHand;
	const pID = data.pID;

	return {
		bet,
		wonTricks,
		score,
		active,
		playedCard,
		cardsInHand,
		pID,
	};
};
