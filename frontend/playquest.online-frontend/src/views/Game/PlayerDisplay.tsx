import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import CardComponent from "../../components/CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import styled from "styled-components";
import { useRef, useState } from "react";

const MainContainer = styled.div`
	display: flex;
	padding-bottom: 20px;
	gap: 10px;
	margin-top: 10px;
`;
const HandRack = styled.div`
	display: flex;
	align-items: flex-end;
	gap: 10px;
	// background: #057f87;
	padding: 10px;
	height: 100px;
`;
const AnimatedCard = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	transition: transform 1s ease;
	transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);
`;

type GameProps = {
	playerInfo: PlayerInfo;
	visibleCardNumber: number;
	makeBet: (bet: number) => void;
	playCard: (cardIndex: number) => void;
	justPlayedCard: Card | null;
	targetCoords: { x: number; y: number } | null;
	offset: { x: number; y: number };
	scoreIncrease: number | null;
};

export default function PlayerDisplay({
	playerInfo,
	visibleCardNumber,
	makeBet,
	playCard,
	justPlayedCard,
	targetCoords,
	offset,
	scoreIncrease,
}: GameProps) {
	const hand = playerInfo.hand.map((card, index) => {
		return (
			<CardComponent
				card={card}
				id={index}
				key={index}
				onClick={() => playCard(index)}
			/>
		);
	});
	console.log("visibleCardNumber", visibleCardNumber);
	const [bet, setBet] = useState<number | null>(null);
	const name = useRef(localStorage.getItem("userName") || "Guest");
	const imageString = useRef(localStorage.getItem("imageString") || "none");

	function cardDisplay() {
		return playerInfo.playedCard ? (
			<CardComponent card={playerInfo.playedCard} />
		) : justPlayedCard ? (
			<CardComponent card={justPlayedCard} />
		) : null;
	}
	const coords = targetCoords
		? { x: targetCoords.x - offset.x, y: targetCoords.y - offset.y + 130 }
		: { x: 0, y: 0 - 100 };
	return (
		<div>
			{/* {cardDisplay()} */}
			{/* because wewant it to be adjusted up */}
			<AnimatedCard $x={coords.x} $y={coords.y}>
				{cardDisplay()}
			</AnimatedCard>
			{playerInfo.playerBet === -1 && playerInfo.active && (
				// magic number
				<div style={{ marginLeft: "100px" }}>
					<p>Place bet:</p>
					<input
						type="number"
						value={bet !== null ? bet : ""}
						onChange={(e) => setBet(parseInt(e.target.value))}
					></input>
					<button
						onClick={() => {
							if(bet!== null){
								makeBet(bet);
							}
						}}
					>
						Submit
					</button>
				</div>
			)}
			<MainContainer>
				<ProfilePicture
					imageString={imageString.current}
					active={playerInfo.active}
					name={name.current}
					score={playerInfo.playerScore}
					scoreIncrease={scoreIncrease}
					bet={playerInfo.playerBet}
					wonTricks={playerInfo.playerWonTricks}
				/>
				<HandRack>{hand.slice(0, visibleCardNumber)}</HandRack>
			</MainContainer>
		</div>
	);
}
