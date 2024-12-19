import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import { GameAction } from "../../../../../gameEngine/GameAction.ts";
import PlayerDisplay from "./PlayerDisplay.tsx";
import OpponentDisplay from "./OpponentDisplay.tsx";
import TrickAndTrump from "./TrickAndTrump.tsx";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import CardComponent from "./CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	// background: #a1a1a1;
	height: 100vh;
	width: 100%;
	margin: 0px;
	position: relative;
	color: white;
`;
const PlayerHolder = styled.div`
	display: flex;
	// justify-content: center;
	padding-left: 10%;
	margin-top: auto;
	margin-bottom: 20px;
	// width: 100%;
`;

const OpponentHolder = styled.div`
	display: flex;
	justify-content: space-around;
	margin-top: 20px;
	width: 100%;
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
	// const [canvasDrawer, setCanvasDrawer] = useState<CanvasDrawer | null>(null);
	const [currentPlayerInfo, setCurrentPlayerInfo] = useState(playerInfo);
	const [justPlayedCard, setJustPlayedCard] = useState<Card | null>(null);
	const [justPlayedPID, setJustPlayedPID] = useState(-1);

	const [targetCoords, setTargetCoords] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const p0 = useRef<HTMLDivElement>(null);
	const p1 = useRef<HTMLDivElement>(null);
	const p2 = useRef<HTMLDivElement>(null);
	const p3 = useRef<HTMLDivElement>(null);
	const opponents = [p0, p1, p2, p3];
	const playerDOM = useRef<HTMLDivElement>(null);
	const [scoreIncreases, setScoreIncreases] = useState<number[] | null[]>([null, null, null, null, null]);


	function resetJustPlayed() {
		setJustPlayedCard(null);
		setJustPlayedPID(-1);
	}

	// useEffect(() => {
	// 	const c = document.getElementById("canvas") as HTMLCanvasElement;
	// 	setCanvasDrawer(new CanvasDrawer(c.height, c.width, c));
	// }, []);

	useEffect(() => {
		stateFlowHandler();
	}, [playerInfo]);

	const opps = currentPlayerInfo.opponents.map((opponent, index) => {
		const coord = opponents[index].current?.getBoundingClientRect();
		return (
			<OpponentDisplay
				opponentInfo={opponent}
				key={index}
				justPlayedCard={justPlayedPID === opponent.pID ? justPlayedCard : null}
				targetCoords={targetCoords}
				offset={coord ? coord : { x: 0, y: 0 }}
				scoreIncrease={scoreIncreases[opponent.pID]}
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
		await sleep(1000);
		for (const action of actions) {
			animateAction(action);
			await sleep(1000);
		}
		//clean up the actions
		setTargetCoords(null);
		setScoreIncreases([null, null, null, null, null]);
	}
	async function animateAction(action: GameAction) {
		// console.log(action.pID + " " + action.name);
		if (action.name === "playCardAction") {
			// console.log("playing card");
			// currentTime();
			setJustPlayedCard(action.card);
			setJustPlayedPID(action.pID);
			const tempPlayer = currentPlayerInfo;
			tempPlayer.hand = tempPlayer.hand.filter(
				(card) => !card.equals(action.card)
			);

			setCurrentPlayerInfo(tempPlayer);
		} else if (action.name === "winTrickAction") {
			console.log("wontrick");
			//get the target based on who won
			const target = { x: 500, y: 500 };
			if (action.pID === currentPlayerInfo.pID) {
				if (playerDOM.current) {
					target.x = playerDOM.current.getBoundingClientRect().x;
					target.y = playerDOM.current.getBoundingClientRect().y - 230; //this is a magic number, just trying to make it look good
				}
			} else {
				let dex = -1;
				currentPlayerInfo.opponents.forEach((opp, index) => {
					if (opp.pID === action.pID) {
						dex = index;
					}
				});
				if (dex !== -1) {
					const ref = opponents[dex];
					if (ref.current) {
						target.x = ref.current.getBoundingClientRect().x;
						target.y = ref.current.getBoundingClientRect().y;
					}
				}
			}
			setTargetCoords(target);
			await sleep(1000);
			// setTargetCoords(null);
		} else if (action.name === "betAction") {
			console.log("bet action");
		} else if (action.name === "dealAction") {
			console.log("deal action");
		} else if (action.name === "revealTrumpAction") {
			console.log("trump action");
		} else if(action.name === "endRoundAction") {
			setScoreIncreases(action.scoreIncreases);
			await sleep(3000);
			// setScoreIncreases([null, null, null, null, null]);
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
			<OpponentHolder>
				{opps[0] ? <div ref={p0}>{opps[0]}</div> : null}
				{opps[1] ? <div ref={p1}>{opps[1]}</div> : null}
				{opps[2] ? <div ref={p2}>{opps[2]}</div> : null}
				{opps[3] ? <div ref={p3}>{opps[3]}</div> : null}
			</OpponentHolder>

			{/* <AnimatedCard $x={playedCoords.x} $y={playedCoords.y}>
				{justPlayedCard ? <CardComponent card={justPlayedCard} /> : null}
			</AnimatedCard> */}
			<TrickAndTrump trump={currentPlayerInfo.trumpCard} />
			<PlayerHolder>
				<div ref={playerDOM}>
					<PlayerDisplay
						playerInfo={currentPlayerInfo}
						makeBet={makeBet}
						playCard={playCard}
						justPlayedCard={
							justPlayedPID === currentPlayerInfo.pID ? justPlayedCard : null
						}
						targetCoords={targetCoords}
						offset={
							playerDOM.current
								? playerDOM.current.getBoundingClientRect()
								: { x: 0, y: 0 }
						}
						scoreIncrease={scoreIncreases[playerInfo.pID]}
					/>
				</div>
			</PlayerHolder>
		</MainContainer>
	);
}
