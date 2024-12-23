//the game class that stores state and is responsible for updating it based on player moves
//also generates the information that should be available for each player
import Deck from "./Deck";
import Card, { Suit } from "./Card";
import PlayerInfo, { OpponentInfo } from "./PlayerInfo";
import GameActionMachine, { GameAction } from "./GameAction";

class Game {
	playerCount: number;
	scores: number[] = [];
	scoreRecord: number[][] = [];
	bets: number[] = [];
	betsRecord: number[][] = [];
	round = 0;
	hands: Card[][] = [];
	wonTricks: Card[][][] = [];
	trumpCard!: Card;
	deck!: Deck;
	dealerIndex!: number;
	handSize!: number;
	activePlayer!: number;
	startingPlayer!: number;
	currTrick: Card[] = [];
	playedCards: Card[] = [];
	betting: boolean = true;
	gameOver: boolean = false;
	timeStep: number = 0;
	gameActionQueue: GameAction[] = [];
	constructor(playerCount: number) {
		if (playerCount < 2 || playerCount > 6) {
			throw new Error(
				"Invalid player count. Count must be between 2 and 6 inclusive."
			);
		}
		this.playerCount = playerCount;
		this.scores = Array(playerCount).fill(0); //everyone starts with 0 points
	}

	//the  meat and potatoes
	//returns 1 if actions was succesful and -1 otherwise
	processAction(playerIndex: number, action: number): number {
		let result = -1;
		//if there aren't enough bets, then the action corresponds to a bet
		if (this.betting) {
			result = this.makeBet(playerIndex, action);
			//turn off betting if all players have bet
			if (result === 1 && this.activePlayer === this.dealerIndex) {
				this.betting = false;
				this.betsRecord.push(this.bets); //record the bets
			}
			//add the bet to the action queue
			if (result === 1) {
				const newAction = GameActionMachine.betAction(playerIndex, action);
				this.gameActionQueue.push(newAction);
			}
		} else {
			//otherwise it corresponds to the index of card to play
			result = this.playCard(playerIndex, action);

			//add the card play to the action queue
			if (result === 1) {
				const newAction = GameActionMachine.playCardAction(
					playerIndex,
					this.playedCards[playerIndex]
				);
				this.gameActionQueue.push(newAction);
			}
		}
		if (result === 1) {
			//check to see if the round is over:
			let roundOver = false;
			if (
				this.nextPlayer(playerIndex) === this.startingPlayer &&
				this.hands[playerIndex].length === 0
			) {
				roundOver = true;
			}
			//if the action was succesful, then we move to the next player
			this.setNextPlayer();
			//check if the trick is over
			if (this.currTrick.length === this.playerCount) {
				this.endTrick(); // will set the player correctly
			}
			if (roundOver) {
				this.scoreRound();
				let handSize = this.handSize;
				if (this.round >= 10) {
					//once we have gone down ten times then we will start going up
					handSize++;
				} else {
					handSize--;
				}
				this.startRound(handSize, this.nextPlayer(this.dealerIndex));
			}
		}

		//see if the timeStep should go up
		if (result === 1) {
			this.timeStep++;
		}
		return result;
	}
	endGame() {
		this.gameOver = true;
		console.log("Game Over!");
		console.log("Final Scores:");
		console.log(this.scores);
	}
	startRound(handSize: number, dealerIndex: number) {
		this.round++;
		if (this.round > 19) {
			this.endGame();
			return;
		}
		this.deck = new Deck();
		this.handSize = handSize;
		this.trumpCard = this.deck.drawCard();
		this.hands = Array(this.playerCount);
		this.wonTricks = Array(this.playerCount);
		for (let i = 0; i < this.playerCount; i++) {
			this.hands[i] = [];
			this.wonTricks[i] = [];
			for (let j = 0; j < handSize; j++) {
				this.hands[i].push(this.deck.drawCard());
			}
		}
		//sort the hands
		this.sortHands();
		this.bets = Array(this.playerCount).fill(-1);
		this.dealerIndex = dealerIndex;
		this.activePlayer = this.nextPlayer(dealerIndex);
		this.startingPlayer = this.activePlayer;
		this.currTrick = [];
		this.playedCards = Array(this.playerCount).fill(null);
		this.betting = true;

		//add the appropriate actions to the action queue
		const gameActionTrump = GameActionMachine.revealTrumpAction(
			this.dealerIndex,
			this.trumpCard
		);
		this.gameActionQueue.push(gameActionTrump);
		const gameActionDeal = GameActionMachine.dealAction(
			this.dealerIndex,
			this.handSize
		);
		this.gameActionQueue.push(gameActionDeal);
	}
	//sorts the hands in ascending order, spades, hearts, diamonds, clubs
	sortHands() {
		for (let i = 0; i < this.playerCount; i++) {
			this.hands[i].sort((a, b) => {
				return a.compare(b);
			});
		}
	}

	//returns the value for the invalid bet, or -1 if any bet is valid
	getInvalidBet(playerIndex: number): number {
		if (playerIndex === this.dealerIndex) {
			//we have to subtract 1, because the dealers bet is technically -1 rn
			return this.handSize - this.bets.reduce((a, b) => a + b) - 1; //it can't sum to the handsize
		}
		return -1;
	}
	//returns -1 if the bet is invalid or failed, or 1 if the bet was succesfully made
	makeBet(playerIndex: number, bet: number) {
		//make sure the player is active player
		if (playerIndex !== this.activePlayer) {
			return -1;
		}
		if (bet === this.getInvalidBet(playerIndex)) {
			return -1;
		}
		//has to be between 0 and 10
		if (bet >= 0 && bet <= 10) {
			this.bets[playerIndex] = bet;
			return 1;
		}
		return -1;
	}
	//gets a random valid bet for the player
	getRandomBet(playerIndex: number): number {
		const invalidBet = this.getInvalidBet(playerIndex);
		if (invalidBet === -1) {
			return Math.floor(Math.random() * (this.handSize + 1));
		}
		const betDex = Math.floor(Math.random() * this.handSize); // because there are 1 less possible options
		if (betDex >= invalidBet) {
			return betDex + 1;
		}
		return betDex;
	}

	getRandomPlay(playerIndex: number): number {
		const validPlays = this.getValidPlays(playerIndex);
		return validPlays[Math.floor(Math.random() * validPlays.length)];
	}
	getValidPlays(playerIndex: number): number[] {
		//if they are the first player, they can play anything
		if (
			this.currTrick.length === 0 ||
			!this.hasSuit(this.hands[playerIndex], this.currTrick[0].getSuit())
		) {
			return Array<number>(this.hands[playerIndex].length)
				.fill(0)
				.map((x, i) => i);
		} else {
			const validPlays: number[] = [];
			this.hands[playerIndex].forEach((card, index) => {
				if (card.getSuit() === this.currTrick[0].getSuit()) {
					validPlays.push(index);
				}
			});
			return validPlays;
		}
	}

	playCard(playerIndex: number, cardIndex: number) {
		//make sure they are able to  play
		if (playerIndex !== this.activePlayer) {
			return -1;
		}
		const validPlays = this.getValidPlays(playerIndex);
		if (validPlays.includes(cardIndex)) {
			this.currTrick.push(this.hands[playerIndex][cardIndex]);
			this.playedCards[playerIndex] = this.hands[playerIndex][cardIndex];
			this.hands[playerIndex].splice(cardIndex, 1);
			return 1;
		}
		return -1;
	}

	endTrick() {
		const winnerIndex = this.determineWinner();
		this.wonTricks[winnerIndex].push(this.currTrick);
		//add the wintrick to the action queue
		const newAction = GameActionMachine.winTrickAction(
			winnerIndex,
			this.currTrick
		);
		this.gameActionQueue.push(newAction);

		this.currTrick = [];
		this.playedCards = Array(this.playerCount).fill(null);
		this.activePlayer = winnerIndex;
		this.startingPlayer = this.activePlayer;
	}

	scoreRound() {
		const scoreIncreases: number[] = [];
		for (let i = 0; i < this.playerCount; i++) {
			const scoreIncrease =
				this.wonTricks[i].length +
				(this.wonTricks[i].length === this.bets[i] ? 10 : 0);
			scoreIncreases.push(scoreIncrease);

			this.scores[i] += scoreIncrease;
		}
		this.scoreRecord.push(this.scores.filter((x) => x)); //need to copy the values so that they don't get changed
		const newAction = GameActionMachine.endRoundAction(scoreIncreases);
		this.gameActionQueue.push(newAction);
	}

	determineWinner() {
		let bestIndex = 0;
		for (let i = 1; i < this.currTrick.length; i++) {
			if (this.isBetter(this.currTrick[i], this.currTrick[bestIndex])) {
				bestIndex = i;
			}
		}
		//if best index is 0, then the startingplayer won
		return (this.startingPlayer + bestIndex) % this.playerCount;
	}

	isBetter(c1: Card, c2: Card) {
		//return true if c1 is better and false if c2 is better
		const trumpSuit = this.trumpCard.getSuit();

		if (c1.suit === c2.suit) {
			return c1.value > c2.value;
		}
		if (c1.suit === trumpSuit) {
			return true;
		}
		if (c2.suit === trumpSuit) {
			return false;
		}
		if (c1.suit === this.currTrick[0].getSuit()) {
			return true;
		}
		return false;
	}

	hasSuit(hand: Card[], suit: Suit | undefined) {
		//if the suit is undefined then they can play anything
		if (suit === undefined) {
			return true;
		}
		for (let i = 0; i < hand.length; i++) {
			const card = hand[i];
			if (card.getSuit() === suit) {
				return true;
			}
		}
		return false;
	}

	setNextPlayer() {
		this.activePlayer = this.nextPlayer(this.activePlayer);
	}

	nextPlayer(currPlayerIndex: number) {
		return (currPlayerIndex + 1) % this.playerCount;
	}
	clearActionQueue() {
		this.gameActionQueue = [];
	}
	generateInfo(playerIndex: number) {
		const opponents: OpponentInfo[] = [];
		for (let i = 0; i < this.playerCount; i++) {
			//to make sure we don't go out of bounds
			// const dex = i;
			const dex = (i + playerIndex) % this.playerCount;
			if (dex !== playerIndex) {
				opponents.push({
					bet: this.bets[dex],
					wonTricks: this.wonTricks[dex],
					score: this.scores[dex],
					active: dex === this.activePlayer,
					cardsInHand: this.hands[dex].length,
					playedCard: this.playedCards[dex],
					pID: dex,
				});
			}
		}
		if (playerIndex >= 0 && playerIndex <= this.playerCount) {
			const returner: PlayerInfo = {
				hand: this.hands[playerIndex],
				trumpCard: this.trumpCard,
				playerBet: this.bets[playerIndex],
				playerWonTricks: this.wonTricks[playerIndex],
				currTrick: this.currTrick,
				startingPlayer: this.startingPlayer,
				playerScore: this.scores[playerIndex],
				active: this.activePlayer === playerIndex,
				playedCard: this.playedCards[playerIndex],
				opponents: opponents,
				timeStep: this.timeStep,
				pID: playerIndex,
				actionQueue: this.gameActionQueue,
				scoreRecord: this.scoreRecord,
				betsRecord: this.betsRecord,
				round: this.round,
				startingHandSize: this.handSize,
				dealerIndex: this.dealerIndex,
			};
			//clear the action queue after we have generated a state
			// this.gameActionQueue = []; //no ! don't clear after we have generated the state, should only clear once we move to another state
			return returner;
		}
		return -1;
	}
	printState(verbose = false) {
		console.log(
			"***###***###***###***###***###***###***###***###***###***###***###***###***###***###***"
		);
		if (verbose) {
			console.log("TrumpCard:");
			console.log(this.trumpCard.print());
			console.log("Bets:");
			console.log(this.bets);
			console.log("Scores: ");
			console.log(this.scores);
			console.log("Won tricks:");
			this.wonTricks.forEach((tricks, index) => {
				console.log("Player " + index + " tricks: ");
				console.log(tricks);
			});
			console.log("Dealer:");
			console.log(this.dealerIndex);
			console.log("Round:");
			console.log(this.round);
			console.log("Cards left in deck:");
			console.log(this.deck.deckSize());
		}
		console.log("Hands:");
		console.log(this.hands);
		console.log("Current trick:");
		console.log(this.currTrick);
		console.log("Active Player:");
		console.log(this.activePlayer);
	}
}

export default Game;
