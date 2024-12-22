import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createGame } from "../../utils/backend";

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
	const [roomCode, setRoomCode] = useState(0);
	const navigate = useNavigate();

	async function handleCreate() {
		const res = await createGame(playerCount);
		console.log(res);
		if (res.port) {
			handleJoin(res.port);
		}
	}
	function handleJoin(port: number) {
		localStorage.setItem("port", port.toString());
		navigate("/GuestAccount");
	}

	return (
		<MainContainer>
			<h1 className="whiteFont">Quest Online</h1>

			<button
				onClick={() => {
					setHosting(true);
					setJoining(false);
				}}
			>
				Create
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
			{hosting && <button onClick={handleCreate}>Start</button>}
			<button
				onClick={() => {
					setJoining(true);
					setHosting(false);
				}}
			>
				Join
			</button>
			{joining && <p className="whiteFont">Enter Room Code</p>}
			{joining && (
				<input
				type="number"
					onChange={(e) => {
						setRoomCode(parseInt(e.target.value));
					}}
				/>
			)}
			{joining && <button onClick={()=>{
				handleJoin(roomCode);
			}}>Go!</button>}
		</MainContainer>
	);
}
