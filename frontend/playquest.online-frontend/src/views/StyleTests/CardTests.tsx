import CardComponent from "../Game/CardComponent";
import Card, {SUITS, VALUES } from "../../../../../gameEngine/Card.ts";
import styled from "styled-components";


const CardContainer = styled.div`
margin-left: 50px;
margin-top: 50px;
display: flex;
flex-direction: column;
gap: 5px;
`;
const CardRow = styled.div`
display: flex;
flex-direction: row;
gap: 5px;
`;
export default function CardTests() {

	const rows = [];
	for (const suit of SUITS) {
		const row: Card[] = [];
		for (const value of VALUES) {
			const card = new Card(suit, value);
			row.push(card);
		}
		rows.push(row);
	}

	return (
		<CardContainer>
			{rows.map((row, i) => (
				<CardRow key={i}>
					{row.map((card, j) => (
						<CardComponent card={card} key={j} />
					))}
				</CardRow>
			))}
		</CardContainer>
	)

}