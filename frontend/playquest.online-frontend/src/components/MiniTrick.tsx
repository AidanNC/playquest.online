import Card from "../../../../gameEngine/Card";
import CardComponent from "./CardComponent";
import styled from "styled-components";

type MiniTrickProps = {
	trick: Card[];
	onClick: () => void;
};

const MainContainer = styled.div`
	position: relative;
	margin-top: 10px;
	height: 20px;
	width: 40px;
`;
const CardContainer = styled.div<{ $offsetX: number; $offsetY: number }>`
	position: absolute;
	cursor: pointer;
	left: ${(props) => props.$offsetX}px;
	top: ${(props) => props.$offsetY}px;
`;

export default function MiniTrick({ trick, onClick }: MiniTrickProps) {
	return (
		<MainContainer>
			{trick.map((card, i) => (
				<CardContainer
					key={i}
					onClick={() => {
						console.log("clicked");
						onClick();
					}}
					$offsetX={10 * i}
					$offsetY={-2 * i}
				>
					<CardComponent card={card} mini={true} />
				</CardContainer>
			))}
		</MainContainer>
	);
}
