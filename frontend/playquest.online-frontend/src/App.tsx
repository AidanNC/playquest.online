import Game from "../../../gameEngine/GameManager.ts"

import './App.css'
import GameComponent from './views/Game/Game'
function App() {
  const game = new Game(3);
  game.startRound(10, 0);
  
  for (let i = 0; i < 3; i++) {
    const activePlayer = game.activePlayer;
    const bet = game.getRandomBet(activePlayer);
    game.processAction(activePlayer, bet);
  }
  for (let j = 0; j < 2; j++) {
		const activePlayer = game.activePlayer;
		const play = game.getRandomPlay(activePlayer);
        console.log(`Player ${activePlayer} plays ${game.hands[activePlayer][play]}`);
		game.processAction(activePlayer, play);
	}
  const playerInfo = game.generateInfo(0);
  return (
    <>

      {playerInfo !== -1 && <GameComponent playerInfo={playerInfo}/>}
    </>
  )
}

export default App
