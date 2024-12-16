import { OpponentInfo } from "../../../../../gameEngine/PlayerInfo.ts";
import styled from "styled-components";
import CardComponent from "./CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";
import ProfilePicture from "./ProfilePicture.tsx";

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
	opponentInfo: OpponentInfo;
	justPlayedCard: Card | null;
	targetCoords: { x: number; y: number } | null;
	offset: { x: number; y: number };
};

export default function OpponentDisplay({
	opponentInfo,
	justPlayedCard,
	targetCoords,
	offset,
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
	return (
		<div>
			<MainContainer>
				<ProfilePicture
					active={opponentInfo.active}
					name="Oppo"
					score={opponentInfo.score}
					bet={opponentInfo.bet}
					wonTricks={opponentInfo.wonTricks}
				/>
			</MainContainer>

			{/* {cardDisplay()} */}

			<AnimatedCard $x={coords.x} $y={coords.y}>
				{cardDisplay()}
			</AnimatedCard>
		</div>
	);
}
