import CardComponent from "./CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts"
import styled from "styled-components";



const MainContainer = styled.div`
	
	
	position: absolute;
	top: calc(50% - 40px);
	left: calc(50% - 20px);
	
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