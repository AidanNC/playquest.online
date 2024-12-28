import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import CardComponent, {
	FaceDownCard,
} from "../../components/CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import styled from "styled-components";
import { useRef, useState, useEffect } from "react";
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
// const BetHolder = styled.form`
// 	margin-left: 100px;
// 	@media (max-width: ${MobileWidth}) {
// 		margin-left: 0px;
// 		background: #9d44fc;
// 		width: 40vw;
// 		left: 2vw;
// 		padding: 2px;
// 		height: calc(15svh - 20px);
// 		padding-left: 10px;
// 		border-radius: 10px;
// 		border: 3px solid var(--main-pink);
// 		position: absolute;
// 		display: flex;
// 		flex-direction: column;
// 		align-items: center;
// 		gap: 5px;
// 		z-index: 100;
// 		input {
// 			width: 50%;
// 		}
// 		p {
// 			margin: 0;
// 		}
// 	}
// `;
const BetHolder = styled.div`
	margin-left: 100px;
	@media (max-width: ${MobileWidth}) {
		margin-left: 0px;
		background: #9d44fc;
		width: 80vw;
		left: 2vw;
		padding: 2px;
		height: calc(15svh - 20px);
		padding-left: 10px;
		border-radius: 10px;
		border: 3px solid var(--main-pink);
		position: absolute;
		display: flex;
		// flex-direction: column;
		flex-wrap: wrap;
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
	validPlays: number[];
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
	validPlays,
}: GameProps) {
	const hand = playerInfo.hand.map((card, index) => {
		return (
			<CardComponent
				card={card}
				id={index}
				key={index}
				onClick={() => playCard(index)}
				highlight={
					playerInfo.playerBet !== -1 &&
					validPlays.includes(index) &&
					playerInfo.active &&
					!playerInfo.playedCard &&
					!justPlayedCard
				}
			/>
		);
	});
	useEffect(() => {
		if (handRackRef.current) {
			handRackRef.current.scrollLeft = handRackRef.current.scrollWidth;
		}
	}, [visibleCardNumber]);
	// const [bet, setBet] = useState<number | null>(null);
	const name = useRef(localStorage.getItem("userName") || "Guest");
	const imageString = useRef(localStorage.getItem("imageString") || "none");
	const handRackRef = useRef<HTMLDivElement>(null);
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
			{playerInfo.playerBet === -1 &&
				playerInfo.active &&
				10 === visibleCardNumber && //the visible card number is automatically set to 10 when the dealing is done
				hand.length > 0 && ( //otherwise the bet screen will show up before the deal starts
					// magic number
					// <BetHolder
					// 	onSubmit={(form) => {
					// 		form.preventDefault();
					// 		if (bet !== null) {
					// 			makeBet(bet);
					// 		}
					// 	}}
					// >
					// 	{bet === playerInfo.invalidBet ? (
					// 		<p style={{ color: "red" }}>Invalid Bet</p>
					// 	) : (
					// 		<p>Place bet:</p>
					// 	)}
					// 	<input
					// 		type="number"
					// 		value={bet !== null ? bet : ""}
					// 		onChange={(e) => setBet(parseInt(e.target.value))}
					// 	></input>

					// 	<button type="submit">Submit</button>
					// </BetHolder>

					<BetActionBar
						invalidBet={playerInfo.invalidBet}
						makeBet={makeBet}
						handSize={playerInfo.startingHandSize}
					/>
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
					isDealer={playerInfo.dealerIndex === playerInfo.pID}
				/>
				<div>
					<HandRack ref={handRackRef}>
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

const BetButton = styled.button`
	&.selected {
		border: 2px solid var(--main-dark);
		background: var(--main-yellow);
	}
	&.invalid {
		background: grey;
		color: red;
	}
	&.notPossible {
		background: grey;
	}
`;

function BetActionBar({
	invalidBet,
	makeBet,
	handSize,
}: {
	invalidBet: number;
	makeBet: (bet: number) => void;
	handSize: number;
}) {
	const [bet, setBet] = useState<number>(-1);
	return (
		<BetHolder>
			{Array.from({ length: 11 }, (_, i) => i ).map((i) => {
				return (
					<BetButton
						key={i}
						className={
							i > handSize
								? "notPossible"
								: i === invalidBet
								? "invalid"
								: i === bet
								? "selected"
								: ""
						}
						onClick={() => {
							if (i <= handSize) {
								setBet(i);
							}
						}}
					>
						{i}
					</BetButton>
				);
			})}
			<button onClick={() => makeBet(bet)}>Bet</button>
		</BetHolder>
	);
}
