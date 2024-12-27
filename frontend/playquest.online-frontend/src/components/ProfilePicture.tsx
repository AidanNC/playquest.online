import styled, { css, keyframes } from "styled-components";
import { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import Card from "../../../../gameEngine/Card";
import ViewTricksModal from "../views/Game/ViewTricksModal";
import MiniTrick from "./MiniTrick";
import { MobileWidth } from "../MediaQueryConstants";

const TrickAndMainContainer = styled.div`
	display: flex;
	flex-direction: row;
`;
const gradientAnimation = keyframes`
  0% {
    background-position:0% 50%;
  }
  50% {
    background-position:100% 50%;
  }
  100% {
    background-position:0% 50%;
  }
`;

const animation = css`
	${gradientAnimation} 2s ease infinite;
`;
const MainContainer = styled.div<{ $active: boolean }>`
	position: relative;
	height: 130px;
	width: 320px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 16px;
	z-index: 1; //so that the won tricks dislay behind the more important content
	${(props) =>
		props.$active
			? css`
					border: 3px solid #ee00ff;
					filter: drop-shadow(0px 0px 6px #ee00ff);
					background: linear-gradient(130deg, #ee00ff, var(--main-yellow));
					background-size: 200% 200%;
					animation: ${animation};
			  `
			: `border: 3px solid var(--blue-border);`} //#6f51f0
	// border: 3px solid ${(props) => (props.$active ? "#ee00ff" : "#6f51f0")};
	margin-right: 20px;
	background-color: #9d44fc;
	// color: #15001c;
	padding-right: 10px;

	@media (max-width: ${MobileWidth}) {
		max-width: 60vw;
		margin-right: 10px;
		padding-right: 5px;
		// max-height: 15vh;
		height: calc(17svh - 20px);
		justify-content: flex-start;
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
	.score {
		transition: ;
	}
	.name {
		text-decoration: underline;
	}

	@media (max-width: ${MobileWidth}) {
		font-size: 18px;
		.name {
			font-size: 23px;
		}
	}
`;

const TrickDisplay = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	margin-right: 20px;
	margin-left: auto;
	width: 80px;
	position: relative;
	@media (max-width: ${MobileWidth}) {
		width: 80px;
		max-height: 15vh;
		// overflow-y: auto;
		margin: 0px;
	}
`;
const DealerCircle = styled.div`
	height: 30px;
	width: 30px;
	border-radius: 50%;
	background-color: var(--main-yellow);
	border: 2px solid var(--main-dark);
	font-size: 20px;
	font-color: var(--white);
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0px;
	top: 0px;
`;
type ProfilePictureProps = {
	imageString: string;
	active: boolean;
	name: string;
	score: number;
	scoreIncrease: number | null;
	bet: number;
	wonTricks: Card[][];
	isDealer: boolean;
};
export default function ProfilePicture({
	imageString,
	active,
	name,
	score,
	scoreIncrease,
	bet,
	wonTricks,
	isDealer,
}: ProfilePictureProps) {
	const [showModal, setShowModal] = useState(false);
	const startColor = "#15001c";
	const [betColor, setBetColor] = useState<string>(startColor);
	const [trickColor, setTrickColor] = useState<string>(startColor);

	const red = "#ff3b68";
	const green = "#77d45d";

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
	}, [wonTricks.length, bet]);

	useEffect(() => {
		if (wonTricks.length === 0) {
			setShowModal(false);
		}
	}, [wonTricks]);

	return (
		<div>
			{showModal && (
				<ViewTricksModal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					tricks={wonTricks}
				/>
			)}
			<TrickAndMainContainer>
				<TrickDisplay>
					{wonTricks.map((trick, i) => (
						<MiniTrick
							onClick={() => {
								setShowModal(true);
							}}
							trick={trick}
							key={i}
						/>
					))}
				</TrickDisplay>
				<MainContainer $active={active}>
					<ProfileImage selected={false} imageString={imageString} />

					<InfoDisplay>
						<p className="name">{name}</p>
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
							Tricks:{" "}
							<span style={{ color: trickColor }}>{wonTricks.length}</span>
						</p>
					</InfoDisplay>
					{isDealer ? <DealerCircle>D</DealerCircle> : null}
				</MainContainer>
			</TrickAndMainContainer>
		</div>
	);
}
