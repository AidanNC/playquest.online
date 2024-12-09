import Game from "./GameManager";

console.log("####################");
console.log("###Starting Game!###");
console.log("####################");
const game = new Game(3);

game.startRound(3, 0);
game.printState(true);
//make bets
for (let i = 0; i < 3; i++) {
	const activePlayer = game.activePlayer;
	const bet = game.getRandomBet(activePlayer);
	game.processAction(activePlayer, bet);
	// game.makeBet(activePlayer, bet);
	// game.setNextPlayer();
}
game.printState(true);

//play tricks
for (let i = 0; i < game.handSize; i++) {
	//each trick
    game.printState();
	for (let j = 0; j < 3; j++) {
		//each player
		const activePlayer = game.activePlayer;
		const play = game.getRandomPlay(activePlayer);
        console.log(`Player ${activePlayer} plays ${game.hands[activePlayer][play]}`);
		game.processAction(activePlayer, play);
		// game.playCard(activePlayer, play);
		// game.setNextPlayer();
		
	}
	// game.endTrick();
}
game.scoreRound();
game.printState(true);
