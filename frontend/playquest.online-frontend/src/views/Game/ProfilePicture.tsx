import styled from "styled-components";
import { useEffect, useState } from "react";

import tongue from "../../assets/img/profile_pictures/happycar.jpg";
import Card from "../../../../../gameEngine/Card";
import ViewTricksModal from "./ViewTricksModal";

const imageNames = [
	"beanbag",
	"chef",
	"dainty",
	"derp",
	"frazzled",
	"happycar",
	"holy",
	"homies",
	"hrmm",
	"introspective",
	"licker",
	"richdoge",
	"shroom",
	"sideways",
	"snooze",
	"stone",
	"swag",
	"tentacle",
	"wise",
	"yawn",
];

const MainContainer = styled.div<{ $active: boolean }>`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 16px;
	${(props) =>
		props.$active
			? "border: 3px solid #ee00ff; filter: drop-shadow(0px 0px 6px #ee00ff);"
			: "border: 3px solid #6f51f0;"}
	// border: 3px solid ${(props) => (props.$active ? "#ee00ff" : "#6f51f0")};
	margin-right: 20px;
	background-color: #9d44fc;
	color: #15001c;
	padding-right: 10px;
`;

const ProfileIcon = styled.div`
	height: 120px;
	width: 120px;
	display: flex;
	justify-content: center;
	align-items: center;
	// background-color: #cbc0fc;
`;

const Icon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
	img {
		border-radius: 16px;
		max-height: 120px;
		max-width: 120px;
		border: 2px solid #15001c;
	}
`;

const InfoDisplay = styled.div`
	padding: 5px;
	font-size: 23px;
	text-align: start;
	transition: color 0.15s linear;
	
	p {
		margin: 0;
		padding: 0;
		transition: opacity 0.3s ease-in-out;
	}
	.tricks {
		cursor: pointer;
	}
	.tricks:hover {
		outline: 1px solid #15001c;
		border-radius: 4px;
	}
	.bet {
		
	}
`;
type ProfilePictureProps = {
	active: boolean;
	name: string;
	score: number;
	bet: number;
	wonTricks: Card[][];
};
export default function ProfilePicture({
	active,
	name,
	score,
	bet,
	wonTricks,
}: ProfilePictureProps) {
	const [showModal, setShowModal] = useState(false);
	const startColor = "#15001c";
	const [betColor, setBetColor] = useState<string>(startColor);
	const [trickColor, setTrickColor] = useState<string>(startColor);
	

	useEffect(() => {
		if(bet !== -1) {
			setBetColor("#ee00ff");
			setTimeout(() => setBetColor(startColor), 250);
		}
	},[bet]);
	useEffect(() => {
		let color = "#ee00ff";
		if(wonTricks.length > bet){
			color = "red";
		}else if(wonTricks.length === bet){
			color = "green";
		}

		if(wonTricks.length !== 0){
			setTrickColor(color);
			setTimeout(() => setTrickColor(startColor), 150);
			setTimeout(() => setTrickColor(color), 300);
			setTimeout(() => setTrickColor(startColor), 450);
		}
		if(wonTricks.length >= bet && bet !== -1){
			setBetColor(color);
			setTimeout(() => setBetColor(startColor), 150);
			setTimeout(() => setBetColor(color), 300);
			setTimeout(() => setBetColor(startColor), 450);
		}
		if(wonTricks.length > bet && bet !== -1){
			setTimeout(() => setBetColor("red"), 600);
			setTimeout(() => setTrickColor("red"), 600);
		}else if(wonTricks.length === bet && bet !== -1){
			setTimeout(() => setBetColor("green"), 600);
			setTimeout(() => setTrickColor("green"), 600);
		}
		if(wonTricks.length === 0 && bet === -1){
			setBetColor(startColor);
			setTrickColor(startColor);
		}
	},[wonTricks.length]);

	
	useEffect(() => {
		if (wonTricks.length === 0) {
			setShowModal(false);
		}
	}, [wonTricks]);
	return (
		<div>
			{showModal && (
				<ViewTricksModal
					onClose={() => setShowModal(false)}
					tricks={wonTricks}
				/>
			)}
			<MainContainer $active={active}>
				<ProfileIcon>
					<Icon>
						<img src={tongue} alt="tongue profile icon" />
					</Icon>
				</ProfileIcon>
				<InfoDisplay>
					<p>{name}</p>
					<p>Score: {score}</p>
					<p className="bet" >Bet: <span style={{color:betColor}}>{bet>-1?bet:0}</span></p>
					<p
						className="tricks"
						onClick={() => setShowModal(wonTricks.length > 0)}
						
					>
						Tricks Won: <span style={{ color: trickColor }}>{wonTricks.length}</span>
					</p>
				</InfoDisplay>
			</MainContainer>
		</div>
	);
}
