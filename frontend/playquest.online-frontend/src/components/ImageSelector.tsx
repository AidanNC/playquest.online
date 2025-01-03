import ProfileImage, { imageNames } from "./ProfileImage";
import styled from "styled-components";
import { useState } from "react";
import { MobileWidth } from "../MediaQueryConstants";


const Row = styled.div`
	display: flex;
	gap: 20px;
`;

const ImageGrid = styled.div`
	display: flex;
	gap: 20px;
	flex-direction: column;
	@media (max-width: ${MobileWidth}) {
		flex-direction: row;
		max-width: 95vw;
		overflow-x: auto;
		border: 1px solid var(--main-pink);
		border-radius: 6px;
		padding: 5px;
		margin: 5px;
	}
`;
const SelectIndicator = styled.div`
	cursor: pointer;
`;

type ImageSelectorProps = {
	propSetImage: (imageString: string) => void;
}

export default function ImageSelector({propSetImage}: ImageSelectorProps) {
	const imageGrid = [];
	const savedImageString = localStorage.getItem("imageString");
	const [selected, setSelected] = useState(
		savedImageString ? imageNames.indexOf(savedImageString) : -1
	);
	function handleSetImage(image: string) {
		propSetImage(image);
	}
	for (let i = 0; i < imageNames.length / 5; i++) {
		const row = [];

		for (let j = 0; j < 5; j++) {
			const image = imageNames[i * 5 + j];
			row.push(
				<SelectIndicator
					key={j}
					onClick={() => {
						setSelected(i * 5 + j);
						handleSetImage(image);
					}}
				>
					<ProfileImage selected={i * 5 + j === selected} imageString={image} />
				</SelectIndicator>
			);
		}
		imageGrid.push(<Row key={i}>{row}</Row>);
	}

	return (
		<div>
				<p className="whiteFont">Choose a profile image!</p>
				<ImageGrid>{imageGrid}</ImageGrid>
			
		</div>
	);
}