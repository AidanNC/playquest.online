import PlayerInfo from "../../../../../gameEngine/PlayerInfo.ts";
import PlayerDisplay from "./PlayerDisplay.tsx";
import OpponentDisplay from "./OpponentDisplay.tsx";
import TrickAndTrump from "./TrickAndTrump.tsx";
import styled from "styled-components";

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

type GameProps = {
	playerInfo: PlayerInfo;
	sendAction: (action:number)=>void;
};
export default function Game({ sendAction, playerInfo }: GameProps) {
	const opps = playerInfo.opponents.map((opponent, index) => {
		return <OpponentDisplay opponentInfo={opponent} key={index} />;
	});

	const makeBet = (bet: number) => {
		console.log("player makes bet: ", bet);
		sendAction(bet);

	};
	const playCard = (cardIndex: number) => {
		console.log("player plays card: ", cardIndex);
		sendAction(cardIndex);
	};

	return (
		<MainContainer>
			<OpponentHolder>{opps}</OpponentHolder>
			<TrickAndTrump trump={playerInfo.trumpCard} />
			<PlayerHolder>
				<PlayerDisplay
					playerInfo={playerInfo}
					makeBet={makeBet}
					playCard={playCard}
				/>
			</PlayerHolder>
		</MainContainer>
	);
}
