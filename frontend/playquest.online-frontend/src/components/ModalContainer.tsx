import { ReactNode } from "react";
import styled from "styled-components";

const MainContainer = styled.div`
	position: absolute;
	top: 10%;
	left: 40%;
	z-index: 100;
	border-radius: 4px;
	background-color: #9d44fc;
	padding-top: 1rem;
	border: 2px solid #ee00ff;
`;

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	margin: 10px;
	overflow: auto;
	// height: 80vh;
`;

const CloseButton = styled.button`
	position: absolute;
	top: -15px;
	right: -20px;
	height: 2rem;
	width: 2rem;
	display: flex;
	justify-content: center;
	z-index: 200;
`;
type ModalContainerProps = {
	children: ReactNode;
	onClose: () => void;
};

export default function ModalContainer({
	children,
	onClose,
}: ModalContainerProps) {
	return (
		<MainContainer>
			<CloseButton onClick={onClose}>X</CloseButton>
			<ContentContainer>{children}</ContentContainer>
		</MainContainer>
	);
}
