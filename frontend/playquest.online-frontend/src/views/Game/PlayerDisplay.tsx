import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import CardComponent from "./CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";
import styled from "styled-components";
import { CiFaceSmile } from "react-icons/ci";
import { useState } from "react";

const MainContainer = styled.div`
	display: flex;
	align-item: flex-end;
	justi
	gap: 10px;
`;
const HandRack = styled.div`
	display: flex;
	align-items: flex-end;
	gap: 10px;
	// background: #057f87;
	padding: 10px;
	height: 100px;
`;
const ProfileIcon = styled.div<{ $active: boolean }>`
	margin-top: auto;
	height: 100px;
	width: 100px;
	background-color: #b2f7b0;
	border: 4px solid ${(props) => (props.$active ? "red" : "black")};
	font-size: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const InfoDisplay = styled.div`
	font-size: 25px;
	text-align: start;
	margin-top: auto;
	p {
		margin: 0;
		padding: 0;
	}
`;

type GameProps = {
	playerInfo: PlayerInfo;
	makeBet: (bet: number) => void;
	playCard: (cardIndex: number) => void;
	justPlayedCard: Card | null;
};

export default function PlayerDisplay({
	playerInfo,
	makeBet,
	playCard,
	justPlayedCard,
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

	const [bet, setBet] = useState(0);
	return (
		<div>
			{playerInfo.playedCard ? (
				<CardComponent card={playerInfo.playedCard} />
			) : justPlayedCard ? (
				<CardComponent card={justPlayedCard} />
			) : null}
			{!playerInfo.playerBet && playerInfo.active && (
				<div>
					<p>Place bet:</p>
					<input
						type="number"
						value={bet}
						onChange={(e) => setBet(Number(e.target.value))}
					></input>
					<button onClick={() => makeBet(bet)}>Submit</button>
				</div>
			)}
			<MainContainer>
				<ProfileIcon $active={playerInfo.active}>
					<CiFaceSmile />
				</ProfileIcon>
				<HandRack>{hand}</HandRack>
				<InfoDisplay>
					<p>Score: {playerInfo.playerScore}</p>
					<p>Bet: {playerInfo.playerBet}</p>
					<p>Tricks Won: {playerInfo.playerWonTricks.length}</p>
				</InfoDisplay>
			</MainContainer>
		</div>
	);
}
