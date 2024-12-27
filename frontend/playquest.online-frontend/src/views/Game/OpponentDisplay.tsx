import { OpponentInfo } from "../../../../../gameEngine/PlayerInfo.ts";
import styled from "styled-components";
import CardComponent from "../../components/CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import { MobileWidth } from "../../MediaQueryConstants.ts";

const MainContainer = styled.div`
	display: flex;
	gap: 10px;
	margin-bottom: 10px;
	@media (max-width: ${MobileWidth}) {
		margin-bottom: 0;
}
`;
const AnimatedCard = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	transition: transform 1s ease;
	transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);
	@media (max-width: ${MobileWidth}) {
		left: 84vw;
		transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);
	}
`;
const CompleteContainer = styled.div`
	@media (max-width: ${MobileWidth}) {
		width: 100vw;
		display: flex;
	}
`;
type Props = {
	name: string;
	imageString: string;
	opponentInfo: OpponentInfo;
	justPlayedCard: Card | null;
	targetCoords: { x: number; y: number } | null;
	offset: { x: number; y: number };
	scoreIncrease: number | null;
	finalTrick: Card[] | null;
	finalTrickWinner: number;
	isDealer: boolean;
};

export default function OpponentDisplay({
	name,
	imageString,
	opponentInfo,
	justPlayedCard,
	targetCoords,
	offset,
	scoreIncrease,
	finalTrick,
	finalTrickWinner,
	isDealer,
}: Props) {
	function cardDisplay() {
		if(opponentInfo.roundOfOneCard){
			return <CardComponent card={opponentInfo.roundOfOneCard} />
		}
		return opponentInfo.playedCard ? (
			<CardComponent card={opponentInfo.playedCard} />
		) : justPlayedCard ? (
			<CardComponent card={justPlayedCard} />
		) : null;
	}
	const coords = targetCoords
		? { x: targetCoords.x - offset.x, y: targetCoords.y - offset.y }
		: { x: 0, y: 0 };

	const wonTricks =
		opponentInfo.pID === finalTrickWinner && finalTrick
			? [...opponentInfo.wonTricks, finalTrick]
			: opponentInfo.wonTricks;
	return (
		<CompleteContainer>
			<MainContainer>
				<ProfilePicture
					// will fix the imagestring later TODO
					imageString={imageString}
					active={opponentInfo.active}
					name={name}
					score={opponentInfo.score}
					scoreIncrease={scoreIncrease}
					bet={opponentInfo.bet}
					wonTricks={wonTricks}
					isDealer={isDealer}
				/>
			</MainContainer>

			{/* {cardDisplay()} */}
			<div>
				<AnimatedCard $x={coords.x} $y={coords.y}>
					{cardDisplay()}
				</AnimatedCard>
			</div>
		</CompleteContainer>
	);
}
