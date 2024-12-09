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
	playedCard: Card;
	opponents: OpponentInfo[];
}

export interface OpponentInfo {
	bet: number;
	wonTricks: Card[][];
	score: number;
	active: boolean;
	cardsInHand: number;
	playedCard: Card;
}