import CardComponent, {FaceDownCard} from "../../components/CardComponent.tsx";
import Card, { SUITS, VALUES } from "../../../../../gameEngine/Card.ts";
import styled from "styled-components";
import MiniTrick from "../../components/MiniTrick.tsx";

const CardContainer = styled.div`
	margin-left: 50px;
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;
const CardRow = styled.div`
	display: flex;
	flex-direction: row;
	gap: 9px;
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
		<div>
			<CardContainer>
				{rows.map((row, i) => (
					<CardRow key={i}>
						{row.map((card, j) => (
							<CardComponent card={card} key={j} />
						))}
					</CardRow>
				))}
			</CardContainer>
			<div style={{ display: "flex" }}>
				<MiniTrick
					trick={[
						new Card("S", 10),
						new Card("S", 5),
						new Card("S", 4),
						new Card("D", 4),
						new Card("D", 5),
					]}
				/>
				<MiniTrick
					trick={[
						new Card("C", 10),
						new Card("C", 5),
						new Card("C", 4),
						new Card("C", 4),
						new Card("C", 5),
					]}
				/>
			</div>
			<FaceDownCard />
		</div>
	);
}
