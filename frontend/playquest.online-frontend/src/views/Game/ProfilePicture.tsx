import styled from "styled-components";
import { useEffect, useState } from "react";

import beanbag from "../../assets/img/profile_pictures/beanbag.jpg";
import chef from "../../assets/img/profile_pictures/chef.jpg";
import dainty from "../../assets/img/profile_pictures/dainty.jpg";
import derp from "../../assets/img/profile_pictures/derp.jpg";
import frazzled from "../../assets/img/profile_pictures/frazzled.jpg";
import happycar from "../../assets/img/profile_pictures/happycar.jpg";
import holy from "../../assets/img/profile_pictures/holy.jpg";
import homies from "../../assets/img/profile_pictures/homies.jpg";
import hrmm from "../../assets/img/profile_pictures/hrmm.jpg";
import introspective from "../../assets/img/profile_pictures/introspective.jpg";
import licker from "../../assets/img/profile_pictures/licker.jpg";
import richdoge from "../../assets/img/profile_pictures/richdoge.jpg";
import shroom from "../../assets/img/profile_pictures/shroom.jpg";
import sideways from "../../assets/img/profile_pictures/sideways.jpg";
import snooze from "../../assets/img/profile_pictures/snooze.jpg";
import stone from "../../assets/img/profile_pictures/stone.jpg";
import swag from "../../assets/img/profile_pictures/swag.jpg";
import tentacle from "../../assets/img/profile_pictures/tentacle.jpg";
import wise from "../../assets/img/profile_pictures/wise.jpg";
import yawn from "../../assets/img/profile_pictures/yawn.jpg";
import Card from "../../../../../gameEngine/Card";
import ViewTricksModal from "./ViewTricksModal";

const images = [
	beanbag, 
	chef,
	dainty,
	derp,
	frazzled,
	happycar,
	holy,
	homies,
	hrmm,
	introspective,
	licker,
	richdoge,
	shroom,
	sideways,
	snooze,
	stone,
	swag,
	tentacle,
	wise,
	yawn,
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
	scoreIncrease: number | null;
	bet: number;
	wonTricks: Card[][];
};
export default function ProfilePicture({
	active,
	name,
	score,
	scoreIncrease,
	bet,
	wonTricks,
}: ProfilePictureProps) {
	const [showModal, setShowModal] = useState(false);
	const startColor = "#15001c";
	const [betColor, setBetColor] = useState<string>(startColor);
	const [trickColor, setTrickColor] = useState<string>(startColor);
	const [image, setImage] = useState(images[Math.floor(Math.random() * images.length)]);

	const red = "#ff3b68";
	const green = "#77d45d"

	useEffect(() => {
		if (bet !== -1) {
			setBetColor("#ee00ff");
			setTimeout(() => setBetColor(startColor), 250);
		}
	}, [bet]);
	useEffect(() => {
		
		let color = "#ee00ff";
		if (wonTricks.length > bet) {
			color = red; //red
		} else if (wonTricks.length === bet) {
			color = green;
		}

		if (wonTricks.length !== 0) {
			setTrickColor(color);
			setTimeout(() => setTrickColor(startColor), 150);
			setTimeout(() => setTrickColor(color), 300);
			setTimeout(() => setTrickColor(startColor), 450);
		}
		if (wonTricks.length >= bet && bet !== -1) {
			setBetColor(color);
			setTimeout(() => setBetColor(startColor), 150);
			setTimeout(() => setBetColor(color), 300);
			setTimeout(() => setBetColor(startColor), 450);
		}
		if (wonTricks.length > bet && bet !== -1) {
			setTimeout(() => setBetColor(red), 600);
			setTimeout(() => setTrickColor(red), 600);
		} else if (wonTricks.length === bet && bet !== -1) {
			setTimeout(() => setBetColor(green), 600);
			setTimeout(() => setTrickColor(green), 600);
		}
		if (wonTricks.length === 0 && bet === -1) {
			setBetColor(startColor);
			setTrickColor(startColor);
		}
	}, [wonTricks.length]);

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
						<img src={image} alt="tongue profile icon" />
					</Icon>
				</ProfileIcon>
				<InfoDisplay>
					<p>{name}</p>
					<p>
						Score: {score}
						{scoreIncrease !== null && (
							<span
								style={{ color: scoreIncrease === bet + 10 ? green : red }}
							>
								{" "}
								+ {scoreIncrease}
							</span>
						)}
					</p>
					<p className="bet">
						Bet: <span style={{ color: betColor }}>{bet > -1 ? bet : 0}</span>
					</p>
					<p
						className="tricks"
						onClick={() => setShowModal(wonTricks.length > 0)}
					>
						Tricks Won:{" "}
						<span style={{ color: trickColor }}>{wonTricks.length}</span>
					</p>
				</InfoDisplay>
			</MainContainer>
		</div>
	);
}
