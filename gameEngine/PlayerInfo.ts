//This will just be a class definition file for the player info and the opponent info
import Card from "./Card";

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
}

export interface OpponentInfo {
	bet: number;
	wonTricks: Card[][];
	score: number;
	active: boolean;
	cardsInHand: number;
	playedCard: Card | null;
}

//we have to trust that the data is in the correct format, will add error checking later
export const deserializePlayerInfo = (data: any): PlayerInfo => {
	const hand: Card[] = data.hand.map((card: any) => {
		return new Card(card.suit, card.value);
	});
	const trumpCard: Card = new Card(data.trumpCard.suit, data.trumpCard.value);
	const playerBet: number = data.playerBet;
	const playerWonTricks: Card[][] = data.playerWonTricks.map((trick:any)=>{
		return trick.map((card:any)=>{
			return new Card(card.suit, card.value);
		});
	}); //this might not work
	const currTrick: Card[] = data.currTrick.map((card: any) => {
		return new Card(card.suit, card.value);
	});
	const playerScore: number = data.playerScore;
	const active: boolean = data.active;
	const playedCard: Card | null = data.playedCard === null ? null : new Card(
		data.playedCard.suit,
		data.playedCard.value
	);
	const opponents: OpponentInfo[] = data.opponents.map((oppInfo: any)=>{
		return deserializeOpponentInfo(oppInfo);
	}); // this wont work lol
	const startingPlayer: number = data.startingPlayer;


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
	};
};

const deserializeOpponentInfo = (data: any): OpponentInfo => {
	const bet: number = data.bet;
	const wonTricks: Card[][] = data.wonTricks.map((trick:any)=>{
		return trick.map((card:any)=>{
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

	return {
		bet,
		wonTricks,
		score,
		active,
		playedCard,
		cardsInHand,
	};
};
