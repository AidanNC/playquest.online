import ProfileImage, { imageNames } from "../../components/ProfileImage";
import ProfilePicture from "../../components/ProfilePicture";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileContainer = styled.div`
	margin-top: 10px;
	display: flex;
	align-items: center;
	flex-direction: column;
`;
const Row = styled.div`
	display: flex;
	gap: 20px;
`;
const ImageGrid = styled.div`
	display: flex;
	gap: 20px;
	flex-direction: column;
`;
const SelectIndicator = styled.div`
	cursor: pointer;
`;

const MessageDisplay = styled.div`
	align-items: center;
	color: var(--white);
	width: 200px;
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
	const [saveStatus, setSavedStatus] = useState(true);
	const [name, setName] = useState(savedName ? savedName : "");
	function handleSetName(name: string) {
		setSavedStatus(false);
		if (name.length === 0) {
			setName("Guest");
		} else {
			setName(name);
		}
	}
	function handleSetImage(image: string) {
		setSavedStatus(false);
		setImageString(image);
	}
	function handleSubmit() {
		localStorage.setItem("userName", name);
		localStorage.setItem("imageString", imageString);
		setSavedStatus(true);
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
			<ProfileContainer>
				<div style={{ display: "flex", alignItems: "center" }}>
					<ProfilePicture
						imageString={imageString}
						active={false}
						name={name}
						score={0}
						scoreIncrease={null}
						bet={0}
						wonTricks={[]}
					/>

					<MessageDisplay>
						{saveStatus
							? "All Changes Saved!"
							: "Click ready to save your changes!"}
					</MessageDisplay>
				</div>
				<div>
					<p className="whiteFont">Enter a username:</p>
					<Row>
						<input
							maxLength={13}
							defaultValue={name}
							placeholder={"Guest"}
							onChange={(e) => {
								handleSetName(e.target.value);
							}}
						></input>
						
							<button  style={{ marginLeft: "auto" }} onClick={handleSubmit}>
								Ready!
							</button>
							<button  onClick={()=>{navigate("/App")}}>
								Join!
							</button>
						
					</Row>

					<p className="whiteFont">Choose a profile image!</p>
					<ImageGrid>{imageGrid}</ImageGrid>
				</div>
			</ProfileContainer>
		</div>
	);
}
