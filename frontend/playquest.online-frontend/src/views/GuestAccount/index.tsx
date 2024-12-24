import ProfileImage, { imageNames } from "../../components/ProfileImage";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileWidth } from "../../MediaQueryConstants";

const ProfileContainer = styled.div`
	margin-top: 10px;
	display: flex;
	align-items: center;
	flex-direction: column;
	@media (max-width: ${MobileWidth}) {
		flex-wrap: wrap;
		max-width: 100vw;
		overflow-x: hidden;
	}
	
`;
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

const FlexRow = styled.div`
	gap: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	@media (max-width: ${MobileWidth}) {
		flex-direction: column;
		align-items: flex-start;
		align-items: center;
		justify-content: center;
		width: 100%;
		text-align: center;
	}
`;
const AlwaysRow = styled.div`
display: flex;
gap: 20px;
align-items: center;
`;
export default function GuestAccount() {
	const navigate = useNavigate();
	const imageGrid = [];
	const savedImageString = localStorage.getItem("imageString");
	const savedName = localStorage.getItem("userName");
	const [selected, setSelected] = useState(
		savedImageString ? imageNames.indexOf(savedImageString) : -1
	);
	const [imageString, setImageString] = useState(
		savedImageString ? savedImageString : imageNames[0]
	);
	const [name, setName] = useState(savedName ? savedName : "");
	function handleSetName(name: string) {
		
		if (name.length === 0) {
			setName("Guest");
		} else {
			setName(name);
		}
	}
	function handleSetImage(image: string) {
		
		setImageString(image);
	}
	function handleSubmit() {
		localStorage.setItem("userName", name);
		localStorage.setItem("imageString", imageString);
		
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
		<ProfileContainer>
			<FlexRow>
				<AlwaysRow>
					<h1 className="whiteFont">{name}</h1>
					<ProfileImage selected={false} imageString={imageString} />{" "}
				</AlwaysRow>

			</FlexRow>
			
				<p className="whiteFont">Enter a username:</p>
				<AlwaysRow>
					<input
						maxLength={13}
						defaultValue={name}
						placeholder={"Guest"}
						onChange={(e) => {
							handleSetName(e.target.value);
						}}
					></input>

					<button
						onClick={() => {
							handleSubmit();
							navigate("/App");
						}}
					>
						Join!
					</button>
				</AlwaysRow>

				<p className="whiteFont">Choose a profile image!</p>
				<ImageGrid>{imageGrid}</ImageGrid>
			
		</ProfileContainer>
	);
}
