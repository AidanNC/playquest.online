import { OpponentInfo } from "../../../../../gameEngine/PlayerInfo.ts";
import styled from "styled-components";
import { CiFaceSmile } from "react-icons/ci";
import CardComponent from "./CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";

const MainContainer = styled.div`
	display: flex;
	gap: 10px;
`;
const ProfileIcon = styled.div<{ $active: boolean }>`
	height: 100px;
	width: 100px;
	background-color: #f0ffd1;
	border: 2px solid ${(props) => (props.$active ? "red" : "black")};
	font-size: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const InfoDisplay = styled.div`
	font-size: 25px;
	text-align: start;
	p {
		margin: 0;
		padding: 0;
	}
`;
type Props = {
	opponentInfo: OpponentInfo;
	justPlayedCard: Card | null;
};

export default function OpponentDisplay({
	opponentInfo,
	justPlayedCard,
}: Props) {
	return (
		<div>
			<MainContainer>
				<ProfileIcon $active={opponentInfo.active}>
					<CiFaceSmile />
				</ProfileIcon>
				<InfoDisplay>
					<p>Score: {opponentInfo.score}</p>
					<p>Bet: {opponentInfo.bet}</p>
					<p>Tricks Won: {opponentInfo.wonTricks.length}</p>
				</InfoDisplay>
			</MainContainer>
			{opponentInfo.playedCard ? (
				<CardComponent card={opponentInfo.playedCard} />
			) : justPlayedCard ? (
				<CardComponent card={justPlayedCard} />
			) : null}
		</div>
	);
}
