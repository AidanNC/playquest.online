import {
	BsFillSuitDiamondFill,
	BsFillHeartFill,
	BsFillSuitSpadeFill,
	BsFillSuitClubFill,
} from "react-icons/bs";
import styled from "styled-components";
import Card from "../../../../gameEngine/Card.ts";
import { useState } from "react";
import { MobileWidth } from "../MediaQueryConstants.ts";

const MainContainer = styled.div<{
	$color: string;
	$hover: boolean;
	$highlight: boolean;
}>`
	height: 80px;
	width: 60px;
	background-color: #36014a;

	// background-color: ${(props) => props.$color};
	// border: 1px solid ${(props) => props.$color};
	// drop-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	// filter: drop-shadow(0 0 0.3rem crimson);
	// filter: drop-shadow(0px 0px 6px ${(props) => props.$color});
	filter: ${(props) =>
		props.$highlight
			? `drop-shadow(0px 0px 4px var(--main-yellow));
			border: 1px solid var(--main-yellow);
			`
			: `drop-shadow(0px 0px 2px #f5f5c1);`}
	//#f2f21d

	border-radius: 5px;
	display: flex;
	gap: 2px;
	margin: 2px;
	cursor: pointer;
	color: ${(props) => props.$color};
	justify-content: center;
	align-items: center;
	//if something is super small then we will reduce the fontsize
	font-size: 35px;
	font-weight: bold;

	margin-bottom: ${(props) => (props.$hover ? "15px" : "2px")};

	transition: margin-bottom 0.2s ease;
	@media (max-width: ${MobileWidth}) {
		margin-bottom: 2px;
	}
`;
const MiniMainContainer = styled.div<{
	$color: string;
}>`
	height: 20px;
	width: 15px;
	background-color: #36014a;

	// filter: drop-shadow(0px 0px 1px #f5f5c1);
	border: 1px solid #f5f5c1;

	border-radius: 2px;
	display: flex;
	gap: 2px;
	margin: 2px;
	color: ${(props) => props.$color};
	justify-content: center;
	align-items: center;

	font-size: 20px;
	font-weight: bold;

	margin-bottom: 2px;
	&.trump {
		height: 40px;
		width: 30px;
		font-size: 30px;
	}
`;

function getDisplaySuitAndColor(suit: string): [JSX.Element, string] {
	let color = "#f5f5c1";
	let displaySuit: JSX.Element = <BsFillSuitClubFill color="black" />;
	if (suit === "D") {
		color = "#f505f1";
		displaySuit = <BsFillSuitDiamondFill color={color} />;
	} else if (suit === "H") {
		color = "#ff3b68";
		displaySuit = <BsFillHeartFill color={color} />;
	} else if (suit === "S") {
		color = "#00c4cf";
		displaySuit = <BsFillSuitSpadeFill color={color} />;
	} else if (suit === "C") {
		color = "#05f525";
		color = "#88f26b";
		color = "#77d45d";
		displaySuit = <BsFillSuitClubFill color={color} />;
	}
	return [displaySuit, color];
}
interface CardElementProps {
	card: Card;
	id?: number;
	onClick?: () => void;
	mini?: boolean;
	highlight?: boolean;
}

export default function CardComponent({
	card,
	id,
	onClick,
	mini,
	highlight = false,
}: CardElementProps) {
	let color = "#f5f5c1";
	let displaySuit: JSX.Element = <BsFillSuitClubFill color="black" />;
	const [hover, setHover] = useState(false);

	const { name, suit } = card.getNameAndSuit();
	if (suit === "D") {
		color = "#f505f1";
		displaySuit = <BsFillSuitDiamondFill color={color} />;
	} else if (suit === "H") {
		color = "#ff3b68";
		displaySuit = <BsFillHeartFill color={color} />;
	} else if (suit === "S") {
		color = "#00c4cf";
		displaySuit = <BsFillSuitSpadeFill color={color} />;
	} else if (suit === "C") {
		color = "#05f525";
		color = "#88f26b";
		color = "#77d45d";
		displaySuit = <BsFillSuitClubFill color={color} />;
	}

	return (
		<div
			onMouseEnter={() => {
				//only want the cards to go up if they are in our hand (onClick is defined)
				if (onClick === undefined) {
					return;
				}
				setHover(true);
			}}
			onMouseLeave={() => {
				setTimeout(() => setHover(false), 100); // Add timeout for hover effect

				// setHover(false);
			}}
		>
			{mini ? (
				<MiniMainContainer $color={color}>
					<>{name}</>
				</MiniMainContainer>
			) : (
				<MainContainer
					id={"card" + id}
					onClick={() => {
						if (onClick !== undefined) {
							onClick();
						}
					}}
					$color={color}
					$hover={hover}
					$highlight={highlight}
				>
					<>
						{displaySuit}
						{name}
					</>
				</MainContainer>
			)}
		</div>
	);
}

type FaceDownCardProps = {
	onClick: null | (() => void);
};
export function FaceDownCard({ onClick = null }: FaceDownCardProps) {
	const color = "var(--white)";
	return (
		<MainContainer
			$hover={false}
			$color={color}
			onClick={() => {
				if (onClick) {
					onClick();
				}
			}}
		>
			<>?</>
		</MainContainer>
	);
}
export function MiniTrumpCards({ card }: CardElementProps) {
	const [displaySuit, color]: [JSX.Element, string] = getDisplaySuitAndColor(
		card.getNameAndSuit().suit
	);
	return (
		<div style={{ display: "flex", gap: "5px" }}>
			<MiniMainContainer className="trump" $color={color}>
				{displaySuit}
			</MiniMainContainer>
			<MiniMainContainer className="trump" $color={color}>
				{card.getNameAndSuit().name}
			</MiniMainContainer>
		</div>
	);
}
