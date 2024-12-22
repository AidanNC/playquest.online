import Card from "../../../../../gameEngine/Card";
import CardComponent from "../../components/CardComponent";
import styled from "styled-components";
import ModalContainer from "../../components/ModalContainer";

type ViewTricksModalProps = {
	tricks: Card[][];
	onClose: () => void;
};

const TrickContainer = styled.div`
	display: flex;
`;

export default function ViewTricksModal({
	tricks,
	onClose,
}: ViewTricksModalProps) {
	return (
		<ModalContainer onClose={onClose}>
			{tricks.map((trick, index) => {
				return (
					<TrickContainer key={index}>
						{trick.map((card, index) => {
							return <CardComponent card={card} key={index} />;
						})}
					</TrickContainer>
				);
			})}
		</ModalContainer>
	);
}
