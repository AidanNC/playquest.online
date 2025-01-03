import { CheckLoggedIn, Logout } from "../utils/backend";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const MainContainer = styled.div`
	color: var(--white);
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

export default function LoggedInStatus() {
	const navigate = useNavigate();
	const [username, setUsername] = useState(localStorage.getItem("username"));
	useEffect(() => {
		handleCheckLoggedIn();
	}, []);

	async function handleCheckLoggedIn() {
		const result = await CheckLoggedIn();
		if (result.loggedIn === true) {
			localStorage.setItem("username", result.username);
			localStorage.setItem("userName", result.username); // this is for displaying in the game
			setUsername(result.username);
		}
	}

	async function handleLogout() {
		console.log("logging out");
		localStorage.removeItem("username");
		localStorage.removeItem("userName");
		localStorage.removeItem("imageString");
		setUsername("");
		const result = await Logout();
		console.log(result);
	}

	if (username) {
		return (
			<MainContainer>
				<p>Logged in as {username}</p>
				<button
					onClick={() => {
						navigate("/Profile");
					}}
				>
					Profile
				</button>
				<button
					onClick={() => {
						handleLogout();
					}}
				>
					Log Out
				</button>
			</MainContainer>
		);
	}
	return (
		<MainContainer>
			<p>Not logged in</p>
			<button
				onClick={() => {
					navigate("/Login");
				}}
			>
				Login
			</button>
		</MainContainer>
	);
}
