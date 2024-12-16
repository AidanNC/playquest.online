import Card from "../../../../../gameEngine/Card";
import CardComponent from "./CardComponent";
import styled from "styled-components";

type ViewTricksModalProps = {
	tricks: Card[][];
	onClose: () => void;
};

const MainContainer = styled.div`
	position: absolute;
	top: 20%;
	left: 40%;
	z-index: 100;
	display: flex;
	flex-direction: column;
	padding: 10px;
	border-radius: 4px;
	background-color: #9d44fc;
`;

const TrickContainer = styled.div`
	display: flex;
`;

const ButtonDiv = styled.div`
	margin-left: auto;
	margin-right: auto;
	button {
		margin-top: 10px;
	}
`;

export default function ViewTricksModal({
	tricks,
	onClose,
}: ViewTricksModalProps) {
	return (
		<MainContainer>
			{tricks.map((trick, index) => {
				return (
					<TrickContainer key={index}>
						{trick.map((card, index) => {
							return <CardComponent card={card} key={index} />;
						})}
					</TrickContainer>
				);
			})}
			<ButtonDiv>
				<button onClick={onClose}>Close</button>
			</ButtonDiv>
		</MainContainer>
	);
}
