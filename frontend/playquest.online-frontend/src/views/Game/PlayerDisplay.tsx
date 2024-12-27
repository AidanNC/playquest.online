import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import CardComponent, {
	FaceDownCard,
} from "../../components/CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import styled from "styled-components";
import { useRef, useState } from "react";
import { MobileWidth } from "../../MediaQueryConstants.ts";

const MainContainer = styled.div`
	display: flex;
	padding-bottom: 20px;
	gap: 10px;
	margin-top: 10px;
	@media (max-width: ${MobileWidth}) {
		gap: 0px;
		padding-bottom: 0px;
		margin-top: 0px;
		width: 60vw;
	}
`;
const HandRack = styled.div`
	display: flex;
	align-items: flex-end;
	align-items: center;
	gap: 10px;
	// background: #057f87;
	padding: 10px;
	height: 100px;
	@media (max-width: ${MobileWidth}) {
		padding: 0px;
		position: absolute;
		top: 71svh;
		left: 2vw;
		overflow-x: auto;
		// max-width: 80vw;
		// min-width: 60vw;
		width: 80vw;

		border: 1px solid var(--main-pink);
		border-radius: 6px;
	}
`;
const AnimatedCard = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	transition: transform 1s ease;
	transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);
	@media (max-width: ${MobileWidth}) {
		left: 84vw;
		transform: translate(
			${(props) => props.$x}px,
			${(props) => (props.$y === -100 ? props.$y : props.$y - 130)}px
		);
	}
`;
const CompleteContainer = styled.div`
	@media (max-width: ${MobileWidth}) {
		width: 100vw;
		display: flex;
	}
`;
const BetHolder = styled.form`
	margin-left: 100px;
	@media (max-width: ${MobileWidth}) {
		margin-left: 0px;
		background: #9d44fc;
		width: 40vw;
		left: 2vw;
		padding: 2px;
		height: calc(15svh - 20px);
		padding-left: 10px;
		border-radius: 10px;
		border: 3px solid var(--main-pink);
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		z-index: 100;
		input {
			width: 50%;
		}
		p {
			margin: 0;
		}
	}
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
	finalTrick: Card[] | null;
	finalTrickWinner: number;
	validPLays: number[];
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
	finalTrick,
	finalTrickWinner,
	validPLays,
}: GameProps) {
	const hand = playerInfo.hand.map((card, index) => {
		return (
			<CardComponent
				card={card}
				id={index}
				key={index}
				onClick={() => playCard(index)}
				highlight={
					validPLays.includes(index) &&
					playerInfo.active &&
					!playerInfo.playedCard &&
					!justPlayedCard
				}
			/>
		);
	});
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

	const wonTricks =
		playerInfo.pID === finalTrickWinner && finalTrick
			? [...playerInfo.playerWonTricks, finalTrick]
			: playerInfo.playerWonTricks;
	return (
		<CompleteContainer>
			{/* {cardDisplay()} */}
			{/* because wewant it to be adjusted up */}
			<AnimatedCard $x={coords.x} $y={coords.y}>
				{cardDisplay()}
			</AnimatedCard>
			{playerInfo.playerBet === -1 && playerInfo.active && (
				// magic number
				<BetHolder
					onSubmit={(form) => {
						form.preventDefault();
						if (bet !== null) {
							makeBet(bet);
						}
					}}
				>
					{bet === playerInfo.invalidBet ? (
						<p style={{ color: "red" }}>Invalid Bet</p>
					) : (
						<p>Place bet:</p>
					)}
					<input
						type="number"
						value={bet !== null ? bet : ""}
						onChange={(e) => setBet(parseInt(e.target.value))}
					></input>

					<button type="submit">Submit</button>
				</BetHolder>
			)}
			<MainContainer>
				<ProfilePicture
					imageString={imageString.current}
					active={playerInfo.active}
					name={name.current}
					score={playerInfo.playerScore}
					scoreIncrease={scoreIncrease}
					bet={playerInfo.playerBet}
					wonTricks={wonTricks}
				/>
				<div>
					<HandRack>
						{playerInfo.isRoundOfOne
							? !playerInfo.playedCard && (
									<FaceDownCard onClick={() => playCard(0)} />
							  )
							: hand.slice(0, visibleCardNumber)}
					</HandRack>
				</div>
			</MainContainer>
		</CompleteContainer>
	);
}
