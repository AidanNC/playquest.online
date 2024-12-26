// import Game from "../../../gameEngine/GameManager.ts"
import PlayerInfo, {
	deserializePlayerInfo,
} from "../../../gameEngine/PlayerInfo.ts";
import { GetWholeGameInfo } from "../../../gameEngine/GameTest.ts";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import GameComponent from "./views/Game/Game";
import { useNavigate } from "react-router-dom";
// import { useRef } from "react";

function App() {
	const navigate = useNavigate();
	const port = parseInt(localStorage.getItem("port") || "-1");
	if (port === -1) {
		navigate("/");
	}
	// const socketRef = useRef(new WebSocket(`ws://10.0.0.66:${port}`)); //chanage this all the time
	const websocketUrl =
		import.meta.env.VITE_REACT_APP_WEBSOCKET_URL || "ws://10.0.0.66";
	const urlAndPort =
		import.meta.env.VITE_DEVELOPMENT === "true"
			? `${websocketUrl}:${port}`
			: `${websocketUrl}/${port}`;
	const socketRef = useRef(new WebSocket(urlAndPort)); //chanage this all the time
	
	const socket = socketRef.current;
	
	const randomID = () => {
		return Math.floor(Math.random() * 1000000).toString();
	};
	const savedId = localStorage.getItem("clientID");
	const clientID = useRef<string>(savedId || randomID());
	localStorage.setItem("clientID", clientID.current);
	const [playerInfo, setPlayerInfo] = useState<PlayerInfo | -1>(-1);
	const [metaInfo, setMetaInfo] = useState({
		playerNames: [],
		imageStrings: [],
	});
	const [ping, setPing] = useState(-1);
	const lastServerCommunication = useRef<number>(-1);
	const latestTimeStep = useRef<number>(-1);
	
	const [stateList, setStateList] = useState<PlayerInfo[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			const message = JSON.stringify({
				ping: true,
				sentTime: now,
				id: clientID.current,
			});
			socket.send(message);
			//check to see if we haven't heard from the server in a while
			if(lastServerCommunication.current !== -1 && now - lastServerCommunication.current > 5000){
				console.log("lost connection to server");
				setPing(-1);
				
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	function handleSetPlayerInfo(info: PlayerInfo) {
		if(info.timeStep > latestTimeStep.current){
			setPlayerInfo(info);
			latestTimeStep.current = info.timeStep;
		}else{
			console.log("already updated this state timestep");
		}
		
	}
	function updateStateList(info: PlayerInfo) {
		console.log("updating state list ");
		console.log(stateList.length);
		console.log(info.timeStep);
		if (stateList.length === 0) {
			handleSetPlayerInfo(info);
		} else if (info.timeStep !== stateList[stateList.length - 1].timeStep) {
			//don't add to list if we already received this state
			setStateList((prevStateList) => [...prevStateList, info]);
		}
	}

	function nextState() {
		if (stateList.length > 0) {
			const info = stateList[0];
			setStateList([...stateList].slice(1)); // remove the first element
			if (info) {
				handleSetPlayerInfo(info);
			}
		}
	}

	function handleMessage(event: MessageEvent) {
		// console.log("Message from server ", event.data);
		lastServerCommunication.current = Date.now(); //update the last time we heard from the server
		const data = JSON.parse(event.data);
		if (data.playerInfo !== undefined) {
			const info: PlayerInfo = deserializePlayerInfo(data.playerInfo);
			console.log(info);
			// setPlayerInfo(info);
			updateStateList(info);
		}
		if (data.metaInfo !== undefined) {
			setMetaInfo(data.metaInfo);
		}
		if(data.ping !== undefined){
			const now = Date.now();
			const ping = now - data.sentTime;
			setPing(ping);
		}
	}

	useEffect(() => {
		socket.addEventListener("open", () => {
			console.log("Connected to server");
			const message = JSON.stringify({
				join: true,
				id: clientID.current,
				name: localStorage.getItem("userName"),
				imageString: localStorage.getItem("imageString"),
			});
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
	const autoPlay = import.meta.env.VITE_AUTOPLAY === "true";
	useEffect(() => {
		// playGame(3, 10, 1000, updateStateList);

		if (autoPlay) {
			const info = GetWholeGameInfo(5);
			setStateList(info);
		}
	}, []);

	return (
		<>
			{autoPlay && <button onClick={nextState}>Next State</button>}
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
					metaInfo={metaInfo}
					requestNextState={nextState}
					ping={ping}
				/>
			)}
			{playerInfo === -1 && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{<h1 className="whiteFont">Waiting for Players</h1>}
					<h1 className="whiteFont">Room Code: {port}</h1>
					<h1 className="whiteFont">Players:</h1>
					{metaInfo &&
						metaInfo.playerNames.map((name: string) => (
							<h1 className="whiteFont">{name}</h1>
						))}
				</div>
			)}
		</>
	);
}

export default App;
