import CardComponent, {
	MiniTrumpCards,
} from "../../components/CardComponent.tsx";
import Card from "../../../../../gameEngine/Card.ts";
import styled from "styled-components";
import { MobileWidth, MobileWidthInt } from "../../MediaQueryConstants.ts";
import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";


const MainContainer = styled.div`
	
	display: flex;
	align-items: center;
	position: absolute;
	top: calc(60% );
	left: calc(50% - 100px);
	gap: 20px;
	color: var(--white);
	font-size: 1.5rem;
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
	round: number;
	startingHandSize: number;
}
export default function TrickAndTrump({ trump, round, startingHandSize}: Props) {
	return (
		<MainContainer>
			<div style={{display: "flex", alignItems:"center", marginLeft :"5px"}}>
					{startingHandSize}{" "}
					{round < 9 && <FaAngleDoubleDown />}
					{round > 10 && <FaAngleDoubleUp/>}
				</div>
			{window.innerWidth <= MobileWidthInt ? (
				<MiniTrumpCards card={trump} />
			) : (
				<div style={{display: "flex", gap: "10px"}}>
					<p className="whiteFont">Trump:</p>
					<CardComponent
						card={trump}
						mini={window.innerWidth <= MobileWidthInt}
					/>
				</div>
			)}
		</MainContainer>
	);
}
