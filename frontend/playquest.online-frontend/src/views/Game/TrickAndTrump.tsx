import CardComponent from "./CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts"
import styled from "styled-components";

interface Props {
	trump: Card;
	trick: Card[];
}

const MainContainer = styled.div`
	display: flex;
	height: 200px;
	width: 200px;
	margin: auto;
`;

export default function TrickAndTrump({trump, trick}: Props){

	const trickCards = trick.map((card) => {
		return <CardComponent card={card} />;
	});
	return (
		<MainContainer>
			<CardComponent card={trump} />
			{trickCards}
		</MainContainer>
	)
}