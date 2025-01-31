import ModalContainer from "./ModalContainer";
import styled from "styled-components";
import { useState } from "react";

const NotificationContainer = styled.div`
	position: absolute;
	top: 20px;
	right: 5px;
	height: 50px;
	width: 50px;
	border-radius: 100%;
	background-color: var(--main-pink);
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.5rem;
	text-align: center;
	border: 1px solid var(--main-yellow);
	
	&:hover{
		cursor: pointer;
		box-shadow: 0px 0px 10px 0px var(--main-yellow);}
`;
const notes = [
	"-Fix issue where the game will say you are disconnected but won't reconnect.",
	"-Attempted to fix bug which allowed bots to occasionally decide the players move in bot games.",
	"---------",
	"- Added patch notes!",
	"- Fixed bug displaying incorrect login status.",
	"- Fixed bug allowing too many users to join a game causing it to crash.",
	"- Added new profile picture options, try them out!",
	"- Make modals centered on all devices.",
	"- Added basic stats to profile page, check it out!"
]
const patchNumber = 0.2;
export default function PatchNotes() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		isOpen ? (
			<ModalContainer onClose={() => setIsOpen(false)} isOpen={isOpen}>
				<h1>Patch Notes v{patchNumber}</h1>
				<p>{notes.map((note)=>{
					return <li>{note}</li>
				})}</p>
			</ModalContainer>
		) 
		: 
		(
			<NotificationContainer onClick={() => setIsOpen(true)}>
				📝
			</NotificationContainer>
			
		)
	)
}