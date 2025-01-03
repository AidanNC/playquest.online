import { useState } from "react";
import styled from "styled-components";
import { login, register } from "../../utils/backend.ts";
import { useNavigate } from "react-router-dom";

const MainContainer = styled.main`
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 2rem;
	color: var(--white);
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	color: var(--white);
	// width: 80%;
	margin-right: 2rem;
	margin-left: 2rem;
	label {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}
`;

export default function Login() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [email, setEmail] = useState("");
	const [registering, setRegistering] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const [registerError, setRegisterError] = useState(false);
	const [registerSuccess, setRegisterSuccess] = useState(false);

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};
	const handlePassword2Change = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setPassword2(event.target.value);
	};
	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};
	const handleLogin = async () => {
		const response = await login(username, password);
		if (response.success) {
			localStorage.setItem("username", response.username);
			localStorage.setItem("userName", response.username); //this is for displaying the name in game
			navigate("/");
		} else {
			setNotFound(true);
		}
		console.log(response);
	};
	const handleRegister = async () => {
		if(username.length < 3 || username.length > 13){
			alert("Username must be between 3 and 13 characters");
			return;
		}
		if (password !== password2) {
			alert("Passwords do not match");
			return;
		}
		if (password.length < 8) {
			alert("Password must be at least 8 characters");
			return;
		}
		const response = await register(username, password, email);
		if(response.success){
			setRegisterSuccess(true);
			setRegisterError(false);
		}else{
			setRegisterError(true);
			setRegisterSuccess(false);
		}
		console.log(response);
	};

	return (
		<MainContainer>
			<h1>{registering ? "Register" : "Login"}</h1>
			<button
				onClick={() => {
					setRegistering(!registering);
					setNotFound(false);
					setRegisterError(false);
				}}
			>
				{registering ? "Login" : "Register"}
			</button>
			{notFound && !registering && <p>Username or password not found</p>}
			{registerError && registering && <p>Username already in use!</p>}
			{registerSuccess && registering && <p>AccountCreated! Please Login now!</p>}
			<Form
				onSubmit={(form) => {
					form.preventDefault();
					if (registering) {
						handleRegister();
					} else {
						handleLogin();
					}
				}}
			>
				{registering && <p>You won't be able to change your username later!</p>}

				<label>
					Username:
					<input type="text" value={username} onChange={handleUsernameChange} />
				</label>
				<label>
					Password:
					<input
						type="password"
						value={password}
						onChange={handlePasswordChange}
					/>
				</label>
				{registering && (
					<label>
						Confirm:
						<input
							type="password"
							value={password2}
							onChange={handlePassword2Change}
						/>
					</label>
				)}
				{registering && (
					<label>
						Email:
						<input type="email" value={email} onChange={handleEmailChange} />
					</label>
				)}

				<button type="submit">{registering ? "Register" : "Login"}</button>
			</Form>
			<button
				onClick={() => {
					navigate("/");
				}}
			>
				Home
			</button>
		</MainContainer>
	);
}
