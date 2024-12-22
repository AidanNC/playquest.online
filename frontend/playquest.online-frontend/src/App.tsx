// import Game from "../../../gameEngine/GameManager.ts"
import PlayerInfo, {
	deserializePlayerInfo,
} from "../../../gameEngine/PlayerInfo.ts";
import { GetWholeGameInfo } from "../../../gameEngine/GameTest.ts";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import GameComponent from "./views/Game/Game";
// import { useRef } from "react";

const socket = new WebSocket("ws://10.0.0.66:8070"); //chanage this all the time
function App() {
	const randomID = () => {
		return Math.floor(Math.random() * 1000000).toString();
	};
	const clientID = useRef<string>(randomID());
	const [playerInfo, setPlayerInfo] = useState<PlayerInfo | -1>(-1);
	const [stateList, setStateList] = useState<PlayerInfo[]>([]);

	function updateStateList(info: PlayerInfo) {
		console.log("updating state list ");
		console.log(stateList.length);
		console.log(info.timeStep);
		if (stateList.length === 0) {
			setPlayerInfo(info);
		}
		setStateList((prevStateList) => [...prevStateList, info]);
	}

	function nextState() {
		if (stateList.length > 0) {
			const info = stateList[0];
			setStateList([...stateList].slice(1)); // remove the first element
			if (info) {
				setPlayerInfo(info);
			}
		}
	}

	function handleMessage(event: MessageEvent) {
		// console.log("Message from server ", event.data);
		const data = JSON.parse(event.data);
		if (data.playerInfo !== undefined) {
			const info: PlayerInfo = deserializePlayerInfo(data.playerInfo);
			console.log(info);
			// setPlayerInfo(info);
			updateStateList(info);
		}
	}

	useEffect(() => {
		socket.addEventListener("open", () => {
			console.log("Connected to server");
			const message = JSON.stringify({ join: true, id: clientID.current });
			socket.send(message);
		});
	}, []);

	useEffect(() => {
		// socket.addEventListener("message", (event) => {
		//     handleMessage(event);
		// });
		socket.addEventListener("message", handleMessage);
		console.log("Adding event listener");

		return () => socket.removeEventListener("message", handleMessage);
	}, []);

	//test the visuals
	useEffect(() => {
		// playGame(3, 10, 1000, updateStateList);
		const info = GetWholeGameInfo(5);
		setStateList(info);
	}, []);

	return (
		<>
			<button onClick={nextState}>Next State</button>
			{/* {playerInfo !== -1 && <GameComponent playerInfo={playerInfo}/>} */}
			{playerInfo !== -1 && (
				<GameComponent
					sendAction={(action: number) => {
						const message = JSON.stringify({
							action: action,
							id: clientID.current,
						});
						socket.send(message);
					}}
					playerInfo={playerInfo}
					requestNextState={nextState}
				/>
			)}
			{playerInfo === -1 && <h1>Loading...</h1>}
		</>
	);
}

export default App;
