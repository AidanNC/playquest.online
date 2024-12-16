import styled from "styled-components";
import { useEffect, useState } from "react";

import tongue from "../../assets/img/profile_pictures/dainty.jpg";
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
	border-radius: 4px;
	${(props) =>
		props.$active
			? "border: 3px solid #ee00ff; filter: drop-shadow(0px 0px 6px #ee00ff);"
			: "border: 3px solid #6f51f0;"}
	// border: 3px solid ${(props) => (props.$active ? "#ee00ff" : "#6f51f0")};
	margin-right: 20px;
	background-color: #9d44fc;
	color: #44348c;
	color: #15001c;
	padding-right: 10px;
`;

const ProfileIcon = styled.div`
	height: 120px;
	width: 120px;
	// background-color: #cbc0fc;
`;

const Icon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	// border: 2px solid #cbc0fc;
	// border-radius: 4px;
	img {
		border-radius: 4px;
		max-height: 120px;
		max-width: 120px;
	}
`;

const InfoDisplay = styled.div`
	padding: 5px;
	font-size: 23px;
	text-align: start;
	p {
		margin: 0;
		padding: 0;
		transition: opacity 0.5s ease-in-out;
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
	useEffect(() => {
		if(wonTricks.length === 0){
			setShowModal(false);
		}
	}, [wonTricks]);
	return (
		<div>
			{showModal && (<ViewTricksModal onClose={()=>setShowModal(false)} tricks={wonTricks} />)}
			<MainContainer $active={active}>
				<ProfileIcon>
					<Icon>
						<img src={tongue} alt="tongue profile icon" />
					</Icon>
				</ProfileIcon>
				<InfoDisplay>
					<p>{name}</p>
					<p>Score: {score}</p>
					<p>Bet: {bet}</p>
					<p style={{cursor:"pointer"}}onClick={() => setShowModal(wonTricks.length > 0)}>Tricks Won: {wonTricks.length}</p>
				</InfoDisplay>
			</MainContainer>
		</div>
	);
}
