import {
	BsFillSuitDiamondFill,
	BsFillHeartFill,
	BsFillSuitSpadeFill,
	BsFillSuitClubFill,
} from "react-icons/bs";
import styled from "styled-components";
import Card from "../../../../../gameEngine/Card.ts"


const MainContainer = styled.div`
	height: 80px;
	width: 60px;
	background-color: #ffc4f6;
	border: 2px solid ##00181a;
	border-radius: 3px;
	display: flex;
	margin: 2px;
	cursor: pointer;
	color: #000000;
	justify-content: center;
	align-items: center;
	font-size: 25px;
`;

interface CardElementProps {
	card: Card;
	id?: number;
	onClick?: () => void;
}

export default function CardComponent({
	card,
	id,
	onClick,
}: CardElementProps) {
	
	
	let displaySuit: JSX.Element = <BsFillSuitClubFill color="black" />;
	const { name, suit } = card.getNameAndSuit();
	if (suit === "D") {
		displaySuit = <BsFillSuitDiamondFill color="red" />;
	} else if (suit === "H") {
		displaySuit = <BsFillHeartFill color="red" />;
	} else if (suit === "S") {
		displaySuit = <BsFillSuitSpadeFill color="black" />;
	} else if (suit === "C") {
		displaySuit = <BsFillSuitClubFill color="black" />;
	}
	return (
		<MainContainer
			id={"card" + id}
			onClick={() => {
				if (onClick !== undefined) {
					onClick();
				}
			}}
		>
			<>
				<p>{displaySuit}
				{name}</p>
			</>
		</MainContainer>
	);
}
