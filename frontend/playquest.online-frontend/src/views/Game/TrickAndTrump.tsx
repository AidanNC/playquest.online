import CardComponent, {} from "../../components/CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts"
import styled from "styled-components";
import { MobileWidth, MobileWidthInt } from "../../MediaQueryConstants.ts";


const MainContainer = styled.div`
	
	display: flex;
	align-items: center;
	position: absolute;
	top: calc(50% );
	left: calc(50% - 20px);
	gap: 20px;
	@media (max-width: ${MobileWidth}) {
		top: 0px;
		left: auto;
		right: 0px;
		gap: 10px;
	}
}
	
`;

interface Props {
	trump: Card;
}
export default function TrickAndTrump({trump}: Props){

	return (
		<MainContainer>
			<p className="whiteFont">Trump:</p>
			<CardComponent card={trump} mini={window.innerWidth <= MobileWidthInt} />
		</MainContainer>
	)
}