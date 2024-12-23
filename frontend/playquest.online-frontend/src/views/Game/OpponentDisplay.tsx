import { OpponentInfo } from "../../../../../gameEngine/PlayerInfo.ts";
import styled from "styled-components";
import CardComponent from "../../components/CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";
import ProfilePicture from "../../components/ProfilePicture.tsx";

const MainContainer = styled.div`
	display: flex;
	gap: 10px;
	margin-bottom: 10px;
`;
const AnimatedCard = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	transition: transform 1s ease;
	transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);
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
}: Props) {
	function cardDisplay() {
		return opponentInfo.playedCard ? (
			<CardComponent card={opponentInfo.playedCard} />
		) : justPlayedCard ? (
			<CardComponent card={justPlayedCard} />
		) : null;
	}
	const coords = targetCoords
		? { x: targetCoords.x - offset.x, y: targetCoords.y - offset.y }
		: { x: 0, y: 0 };

		const wonTricks = opponentInfo.pID === finalTrickWinner && finalTrick
        ? [...opponentInfo.wonTricks, finalTrick]
        : opponentInfo.wonTricks;
	return (
		<div>
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
				/>
			</MainContainer>

			{/* {cardDisplay()} */}

			<AnimatedCard $x={coords.x} $y={coords.y}>
				{cardDisplay()}
			</AnimatedCard>
		</div>
	);
}
