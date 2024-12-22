import styled from "styled-components";
import { useState } from "react";

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	gap: 30px;
	font-size: 20px;
`;

const PlayerCountRow = styled.div`
	display: flex;
	gap: 20px;
`;
const PlayerCountButton = styled.button`
	&.selected {
		border: 2px solid var(--white);
	}
`;

export default function MainPage() {
	const [playerCount, setPlayerCount] = useState(3);
	const [hosting, setHosting] = useState(false);
	const [joining, setJoining] = useState(false);

	return (
		<MainContainer>
			<h1 className="whiteFont">Quest Online</h1>

			<button
				onClick={() => {
					setHosting(true);
					setJoining(false);
				}}
			>
				Host
			</button>
			{hosting && <p className="whiteFont">Number of players</p>}
			{hosting && (
				<PlayerCountRow>
					<PlayerCountButton
						className={playerCount === 3 ? "selected" : ""}
						onClick={() => setPlayerCount(3)}
					>
						3
					</PlayerCountButton>
					<PlayerCountButton
						className={playerCount === 4 ? "selected" : ""}
						onClick={() => setPlayerCount(4)}
					>
						4
					</PlayerCountButton>
					<PlayerCountButton
						className={playerCount === 5 ? "selected" : ""}
						onClick={() => setPlayerCount(5)}
					>
						5
					</PlayerCountButton>
				</PlayerCountRow>
			)}
			{hosting && <button>Start</button>}
			<button
				onClick={() => {
					setJoining(true);
					setHosting(false);
				}}
			>
				Join
			</button>
			{joining && <p className="whiteFont">Enter Room Code</p>}
			{joining && <input />}
			{joining && <button>Go!</button>}
		</MainContainer>
	);
}
