import Card from "./Card";

interface betAction {
	pID: number;
	amount: number;
	name: "betAction";
}

interface playCardAction {
	pID: number;
	card: Card;
	name: "playCardAction";
}

interface revealTrumpAction {
	pID: number;
	trumpCard: Card;
	name: "revealTrumpAction";
}

interface dealAction {
	pID: number;
	handSize: number;
	name: "dealAction";
}

interface winTrickAction {
	pID: number;
	trick: Card[];
	name: "winTrickAction";
}

type GameAction = betAction | playCardAction | revealTrumpAction | dealAction | winTrickAction;

class GameActionMachine {
	static betAction(pID: number, amount: number): betAction {
		return { pID, amount, name: "betAction" };
	}
	static playCardAction(pID: number, card: Card): playCardAction {
		return { pID, card, name: "playCardAction" };
	}
	static revealTrumpAction(pID: number, trumpCard: Card): revealTrumpAction {
		return {pID,  trumpCard, name: "revealTrumpAction" };
	}
	static dealAction(pID: number, handSize: number): dealAction {
		return { pID, handSize, name: "dealAction" };
	}
	static winTrickAction(pID: number, trick: Card[]): winTrickAction {
		return { pID, trick, name: "winTrickAction" };
	}

	static deserialzeGameAction(data: any): GameAction {
		switch (data.name) {
			case "betAction":
				return GameActionMachine.betAction(data.pID, data.amount);
			case "playCardAction":
				const card = new Card(data.card.suit, data.card.value);
				return GameActionMachine.playCardAction(data.pID, card);
			case "revealTrumpAction":
				return GameActionMachine.revealTrumpAction(data.pID, data.trumpCard);
			case "dealAction":
				return GameActionMachine.dealAction(data.pID, data.handSize);
			case "winTrickAction":
				const trick = data.trick.map((card: any) => { return new Card(card.suit, card.value); });
				return GameActionMachine.winTrickAction(data.pID, trick);
			default:
				throw new Error("Invalid GameAction");
		}
	}
}

export default GameActionMachine;
export type { GameAction };
