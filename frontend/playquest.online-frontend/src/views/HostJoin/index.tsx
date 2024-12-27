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
const JoinForm = styled.form`
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 10px;
	input {
		width: 100px;
	}
`;

export default function MainPage() {
	const [playerCount, setPlayerCount] = useState(3);
	const [hosting, setHosting] = useState(false);
	const [joining, setJoining] = useState(false);
	const [roomCode, setRoomCode] = useState(0);
	const [port, setPort] = useState(-1);
	const navigate = useNavigate();

	async function handleCreate() {
		const res = await createGame(playerCount);
		console.log(res);
		if (res.port) {
			setPort(res.port);
			// handleJoin(res.port);
		}
	}
	function handleJoin(port: number) {
		localStorage.setItem("port", port.toString());
		navigate("/GuestAccount");
	}

	return (
		<MainContainer>
			<h1 className="whiteFont">Quest Online</h1>

			{!hosting && (
				<button
					onClick={() => {
						setHosting(true);
						setJoining(false);
					}}
				>
					Create Game
				</button>
			)}
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
			{hosting && <button onClick={handleCreate}>Create</button>}
			{hosting && port !== -1 && (
				<p className="whiteFont">Your room code is : {port}</p>
			)}
			{!joining && (
				<button
					onClick={() => {
						if (port !== -1) {
							handleJoin(port);
						}
						setJoining(true);
						setHosting(false);
					}}
				>
					Join
				</button>
			)}
			{joining && (
				<JoinForm
					onSubmit={(form) => {
						form.preventDefault();
						handleJoin(roomCode);
					}}
				>
					<p className="whiteFont">Enter Room Code</p>
					<input
						type="number"
						name="roomCode"
						onChange={(e) => {
							setRoomCode(parseInt(e.target.value));
						}}
					/>
					<button type="submit">Go!</button>
				</JoinForm>
			)}
		</MainContainer>
	);
}
