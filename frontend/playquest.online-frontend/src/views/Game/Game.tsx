import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import { GameAction } from "../../../../../gameEngine/GameAction.ts";
import PlayerDisplay from "./PlayerDisplay.tsx";
import OpponentDisplay from "./OpponentDisplay.tsx";
import TrickAndTrump from "./TrickAndTrump.tsx";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import CanvasDrawer from "./CanvasDrawer.tsx";
import CardComponent from "./CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: #a1a1a1;
	height: 100vh;
	width: 100vw;
	margin: 0px;
	position: relative;
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
const AnimatedCard = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	top: ${(props) => props.$y}px;
	left: ${(props) => props.$x}px;
`;

const Canvas = styled.canvas`
	border: 1px solid pink;
	width: 100%;
	height: 100%;
	position: absolute;
	pointer-events: none;
`;

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type GameProps = {
	playerInfo: PlayerInfo;
	sendAction: (action: number) => void;
	requestNextState: () => void;
};
export default function Game({
	sendAction,
	playerInfo,
	requestNextState,
}: GameProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasDrawer = useRef<CanvasDrawer | null>(null);
	// const [canvasDrawer, setCanvasDrawer] = useState<CanvasDrawer | null>(null);
	const [currentPlayerInfo, setCurrentPlayerInfo] = useState(playerInfo);
	const [justPlayedCard, setJustPlayedCard] = useState<Card | null>(null);
	const [justPlayedPID, setJustPlayedPID] = useState(-1);

	function resetJustPlayed() {
		setJustPlayedCard(null);
		setJustPlayedPID(-1);
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const parent = canvas.parentElement;
			if (parent) {
				canvas.width = parent.clientWidth;
				canvas.height = parent.clientHeight;
			}
			// canvasDrawer.current = new CanvasDrawer(canvas.height, canvas.height, canvas);
			canvasDrawer.current = new CanvasDrawer(
				canvas.height,
				canvas.width,
				canvas
			);
		}
	}, []);
	// useEffect(() => {
	// 	const c = document.getElementById("canvas") as HTMLCanvasElement;
	// 	setCanvasDrawer(new CanvasDrawer(c.height, c.width, c));
	// }, []);

	useEffect(() => {
		stateFlowHandler();
	}, [playerInfo]);

	const opps = currentPlayerInfo.opponents.map((opponent, index) => {
		return (
			<OpponentDisplay
				opponentInfo={opponent}
				key={index}
				justPlayedCard={justPlayedPID === opponent.pID ? justPlayedCard : null}
			/>
		);
	});

	async function stateFlowHandler() {
		//see if we have a state to process
		await processActions(playerInfo.actionQueue);
		//after we have processed the actions we will update the player info
		// console.log("getting new state");
		// currentTime();
		resetJustPlayed();
		// await sleep(1000);
		setCurrentPlayerInfo(playerInfo);
		requestNextState();
	}
	async function processActions(actions: GameAction[]) {
		// await sleep(1000);
		for (const action of actions) {
			animateAction(action);
			await sleep(1000);
		}
	}
	function animateAction(action: GameAction) {
		// console.log(action.pID + " " + action.name);
		if (action.name === "playCardAction") {
			// console.log("playing card");
			// currentTime();
			setJustPlayedCard(action.card);
			setJustPlayedPID(action.pID);
		}
	}

	//set the opponent info

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
			<button
				onClick={() => {
					canvasDrawer.current?.drawBouncy(10, 8, 8, 100, 50);
				}}
			>
				Draw something
			</button>
			<Canvas id="canvas" ref={canvasRef}></Canvas>
			<OpponentHolder>{opps}</OpponentHolder>
			{/* <AnimatedCard $x={playedCoords.x} $y={playedCoords.y}>
				{justPlayedCard ? <CardComponent card={justPlayedCard} /> : null}
			</AnimatedCard> */}
			<TrickAndTrump trump={currentPlayerInfo.trumpCard} />
			<PlayerHolder>
				<PlayerDisplay
					playerInfo={currentPlayerInfo}
					makeBet={makeBet}
					playCard={playCard}
					justPlayedCard={justPlayedPID === currentPlayerInfo.pID ? justPlayedCard : null}
				/>
			</PlayerHolder>
		</MainContainer>
	);
}
