import CardComponent from "./CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts"
import styled from "styled-components";



const MainContainer = styled.div`
	
	margin: auto;
	position: relative;
	
`;

interface Props {
	trump: Card;
}
export default function TrickAndTrump({trump}: Props){

	return (
		<MainContainer>
			<CardComponent card={trump} />
		</MainContainer>
	)
}