import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import PlayerDisplay from "./PlayerDisplay.tsx";
import OpponentDisplay from "./OpponentDisplay.tsx";
import TrickAndTrump from "./TrickAndTrump.tsx";
import styled from "styled-components";
type GameProps = {
	playerInfo: PlayerInfo;
};

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: #a1a1a1;
	height: 100vh;
	width: 100vw;
	margin: 0px;
`;
const PlayerHolder = styled.div`
	display: flex;
	justify-content: center;
	margin-top: auto;
	margin-bottom: 20px;
	width: 100%;
`;

const OpponentHolder = styled.div`
	display: flex;
	justify-content: space-around;
	margin-top: 20px;
	width: 100%;
`;


export default function Game({ playerInfo }: GameProps) {
	const opps = playerInfo.opponents.map((opponent) => {
		return <OpponentDisplay opponentInfo={opponent} />;
	});
	return (
		<MainContainer>
			<OpponentHolder>
			{opps}
			</OpponentHolder>
			<TrickAndTrump trump={playerInfo.trumpCard} trick={playerInfo.currTrick}/>
			<PlayerHolder>
				<PlayerDisplay playerInfo={playerInfo} />
			</PlayerHolder>
		</MainContainer>
	);
}
