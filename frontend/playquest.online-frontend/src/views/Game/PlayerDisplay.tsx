import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import CardComponent from "./CardComponent.tsx";
import styled from "styled-components";
import { CiFaceSmile } from "react-icons/ci";
type GameProps = {
	playerInfo: PlayerInfo;
};

const MainContainer = styled.div`
	display: flex;
	gap: 10px;
`;
const HandRack = styled.div`
	display: flex;
	gap: 10px;
	background: #057f87;
	padding: 10px;
	height: 85px;
`;
const ProfileIcon = styled.div<{active: boolean}>`
	height: 100px;
	width: 100px;
	background-color: #b2f7b0;
	border: 4px solid ${props => props.active ? "red" : "black"};
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

export default function PlayerDisplay({ playerInfo }: GameProps) {
	const hand = playerInfo.hand.map((card) => {
		return <CardComponent card={card} />;
	});
	return (
		<MainContainer>
			<ProfileIcon active={playerInfo.active}>
				<CiFaceSmile />
			</ProfileIcon>
			<HandRack>{hand}</HandRack>
			<InfoDisplay>
				<p>Score: {playerInfo.playerScore}</p>
				<p>Bet: {playerInfo.playerBet}</p>
				<p>Tricks Won: {playerInfo.playerWonTricks.length}</p>
			</InfoDisplay>
		</MainContainer>
	);
}
