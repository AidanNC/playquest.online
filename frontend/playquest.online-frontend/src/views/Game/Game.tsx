import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import { GameAction } from "../../../../../gameEngine/GameAction.ts";
import PlayerDisplay from "./PlayerDisplay.tsx";
import OpponentDisplay from "./OpponentDisplay.tsx";
import TrickAndTrump from "./TrickAndTrump.tsx";
import styled from "styled-components";
import { useEffect } from "react";

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: #a1a1a1;
	height: 100vh;
	width: 100vw;
	margin: 0px;
`;
const PlayerHolder = styled.div`
	display: flex;
	justify-content: center;
	margin-top: auto;
	margin-bottom: 20px;
	width: 100%;
`;

const OpponentHolder = styled.div`
	display: flex;
	justify-content: space-around;
	margin-top: 20px;
	width: 100%;
`;

type GameProps = {
	playerInfo: PlayerInfo;
	sendAction: (action: number) => void;
	requestNextState: () => void;
};
export default function Game({ sendAction, playerInfo, requestNextState }: GameProps) {

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	useEffect(() => {
		stateFlowHandler();
		
	},[playerInfo]);

	async function stateFlowHandler() {
		//see if we have a state to process
		await processActions(playerInfo.actionQueue);
		//after we have processed the actions we will update the player info
		requestNextState();
	}
	async function processActions(actions: GameAction[]) {
		for( const action of actions){
			animateAction(action);
			await sleep(5000);
		}
	}
	function animateAction(action: GameAction) {
		console.log(action.pID + " " + action.name);
	}
	
	

	//set the opponent info
	const opps = playerInfo.opponents.map((opponent, index) => {
		return <OpponentDisplay opponentInfo={opponent} key={index} />;
	});

	const makeBet = (bet: number) => {
		// console.log("player makes bet: ", bet);
		sendAction(bet);
	};
	const playCard = (cardIndex: number) => {
		// console.log("player plays card: ", cardIndex);
		sendAction(cardIndex);
	};
	return (
		<MainContainer>
			<button onClick={requestNextState}>Next State</button>
			<OpponentHolder>{opps}</OpponentHolder>
			<TrickAndTrump trump={playerInfo.trumpCard} />
			<PlayerHolder>
				<PlayerDisplay
					playerInfo={playerInfo}
					makeBet={makeBet}
					playCard={playCard}
				/>
			</PlayerHolder>
		</MainContainer>
	);
}
