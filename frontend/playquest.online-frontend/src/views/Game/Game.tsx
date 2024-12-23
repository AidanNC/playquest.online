import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import { GameAction } from "../../../../../gameEngine/GameAction.ts";
import PlayerDisplay from "./PlayerDisplay.tsx";
import OpponentDisplay from "./OpponentDisplay.tsx";
import TrickAndTrump from "./TrickAndTrump.tsx";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import Card from "../../../../../gameEngine/Card.ts";
import AllRoundScoreboardModal from "./AllRoundScoreboardModal.tsx";
import DealingCard from "./DealingCard.tsx";

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	// background: #a1a1a1;
	height: 100vh;
	width: 100%;
	margin: 0px;
	position: relative;
`;
const PlayerHolder = styled.div`
	display: flex;
	// justify-content: center;
	padding-left: 10%;
	margin-top: auto;
	margin-bottom: 20px;
	// width: 100%;
`;

const TopOpponentHolder = styled.div`
	display: flex;
	justify-content: center;
	gap: 60px;
	margin-top: 20px;
	width: 100%;
`;
const BottomOpponentHolder = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 90px;
	margin-left: 2%;
	margin-right: 2%;
`;

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type GameProps = {
	playerInfo: PlayerInfo;
	sendAction: (action: number) => void;
	requestNextState: () => void;
	metaInfo: { playerNames: string[]; imageStrings: string[] };
};
export default function Game({
	sendAction,
	playerInfo,
	requestNextState,
	metaInfo,
}: GameProps) {
	// const [canvasDrawer, setCanvasDrawer] = useState<CanvasDrawer | null>(null);
	const [showScoreBoard, setShowScoreBoard] = useState(false);
	const [currentPlayerInfo, setCurrentPlayerInfo] = useState(playerInfo);
	const [justPlayedCard, setJustPlayedCard] = useState<Card | null>(null);
	const [justPlayedPID, setJustPlayedPID] = useState(-1);
	const [playDealAnimation, setPlayDealAnimation] = useState(false);
	const [visibleCardNumber, setVisibleCardNumber] = useState(10);
	const [finalTrick, setFinalTrick] = useState<Card[] | null>(null);
	const [finalTrickWinner, setFinalTrickWinner] = useState<number>(-1);
	 

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
	const [scoreIncreases, setScoreIncreases] = useState<number[] | null[]>([
		null,
		null,
		null,
		null,
		null,
	]);

	function getDealerTargetCoords() {
		const coords: { x: number; y: number }[] = [];

		if (playerDOM.current) {
			coords.push(getCoords(playerDOM.current));
		}
		opponents.forEach((ref) => {
			if (ref.current) {
				coords.push(getCoords(ref.current));
			}
		});
		// if (playerDOM.current) {
		// 	coords.splice(currentPlayerInfo.pID, 0, getCoords(playerDOM.current));
		// }
		function getCoords(obj: HTMLDivElement) {
			return {
				x: obj.getBoundingClientRect().x,
				y: obj.getBoundingClientRect().y,
			};
		}
		return coords;
	}
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
				name={metaInfo.playerNames[opponent.pID]}
				imageString={metaInfo.imageStrings[opponent.pID]}
				opponentInfo={opponent}
				key={index}
				justPlayedCard={justPlayedPID === opponent.pID ? justPlayedCard : null}
				targetCoords={targetCoords}
				offset={coord ? coord : { x: 0, y: 0 }}
				scoreIncrease={scoreIncreases[opponent.pID]}
				finalTrick={finalTrick}
				finalTrickWinner={finalTrickWinner}
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
			await animateAction(action, actions);
			// await sleep(1000);
		}
		//clean up the actions
		setTargetCoords(null);
		setScoreIncreases([null, null, null, null, null]);
	}
	async function animateAction(action: GameAction, actions: GameAction[]) {
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
			await sleep(1000);
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
			setScoreIncreases([null, null, null, null, null]);
			resetJustPlayed(); //make it disappear for when we deal
			setCurrentPlayerInfo(playerInfo); //want to have the new hand information
			console.log("deal action");
			setVisibleCardNumber(0);
			setPlayDealAnimation(true);
			await sleep(10000);
			setPlayDealAnimation(false);
			setVisibleCardNumber(10);
		} else if (action.name === "revealTrumpAction") {
			console.log("trump action");
		} else if (action.name === "endRoundAction") {
			console.log("end round action");

			//get the final trick from the action queue, duh lol
			let currentTrick: Card[] | null = null;
			let winnerIndex = -1;
			//we need to find what the iwnning trick was this round and who won it
			for (const act of actions) {
				if (act.name === "winTrickAction") {
					currentTrick = act.trick;
					winnerIndex = act.pID;
				}
			}
			console.log(currentTrick);
			console.log(winnerIndex);
			//now we give the right winner the current trick
			if (currentTrick)
				setFinalTrick(currentTrick);
			setFinalTrickWinner(winnerIndex);

			setScoreIncreases(action.scoreIncreases);

			await sleep(5000);
			setFinalTrick(null);
			setFinalTrickWinner(-1);
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
			{playDealAnimation && (
				<DealingCard
					numCards={
						currentPlayerInfo.startingHandSize *
						(1 + currentPlayerInfo.opponents.length)
					}
					coordinates={getDealerTargetCoords()}
					dealerIndex={
						//this cooked math needs to be looked at again and explained for future me
						(currentPlayerInfo.dealerIndex +
							1 +
							currentPlayerInfo.opponents.length -
							currentPlayerInfo.pID) %
						(1 + currentPlayerInfo.opponents.length)
					}
					incrementCard={(index: number, value: number) => {
						if (index === currentPlayerInfo.pID) {
							if (currentPlayerInfo.dealerIndex !== currentPlayerInfo.pID) {
								value += 1;
							}
							setVisibleCardNumber(value);
						}
					}}
				/>
			)}
			<button onClick={() => setShowScoreBoard(true)}>Show Scoreboard</button>
			{playerInfo && showScoreBoard && (
				<AllRoundScoreboardModal
					isOpen={showScoreBoard}
					playerNames={metaInfo.playerNames}
					scoreRecord={currentPlayerInfo.scoreRecord}
					betsRecord={currentPlayerInfo.betsRecord}
					onClose={() => {
						setShowScoreBoard(false);
					}}
				/>
			)}
			{/* 3player game */}
			{!opps[2] && (
				<TopOpponentHolder>
					{opps[0] ? <div ref={p0}>{opps[0]}</div> : null}
					{opps[1] ? <div ref={p1}>{opps[1]}</div> : null}
				</TopOpponentHolder>
			)}
			{/* 4 player game */}
			{opps[2] && !opps[3] && (
				<div>
					<TopOpponentHolder>
						{opps[1] ? <div ref={p1}>{opps[1]}</div> : null}
					</TopOpponentHolder>
					<BottomOpponentHolder>
						{opps[0] ? <div ref={p0}>{opps[0]}</div> : null}

						{opps[2] ? <div ref={p2}>{opps[2]}</div> : null}
					</BottomOpponentHolder>
				</div>
			)}
			{/* 5 player game */}
			{opps[2] && opps[3] && (
				<div>
					<TopOpponentHolder>
						{opps[1] ? <div ref={p1}>{opps[1]}</div> : null}
						{opps[2] ? <div ref={p2}>{opps[2]}</div> : null}
					</TopOpponentHolder>
					<BottomOpponentHolder>
						{opps[0] ? <div ref={p0}>{opps[0]}</div> : null}
						{opps[3] ? <div ref={p3}>{opps[3]}</div> : null}
					</BottomOpponentHolder>
				</div>
			)}

			{/* <AnimatedCard $x={playedCoords.x} $y={playedCoords.y}>
				{justPlayedCard ? <CardComponent card={justPlayedCard} /> : null}
			</AnimatedCard> */}

			<TrickAndTrump trump={currentPlayerInfo.trumpCard} />

			<PlayerHolder>
				<div ref={playerDOM}>
					<PlayerDisplay
						playerInfo={currentPlayerInfo}
						visibleCardNumber={playDealAnimation ? visibleCardNumber : 10}
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
						finalTrick={finalTrick}
						finalTrickWinner={finalTrickWinner}
					/>
				</div>
			</PlayerHolder>
		</MainContainer>
	);
}
