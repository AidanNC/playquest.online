import ProfileImage, { imageNames } from "../../components/ProfileImage";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileWidth } from "../../MediaQueryConstants";
import ImageSelector from "../../components/ImageSelector";

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
	
	const savedImageString = localStorage.getItem("imageString");
	const savedName = localStorage.getItem("userName");
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

	function handleSubmit() {
		localStorage.setItem("userName", name);
		localStorage.setItem("imageString", imageString);
		
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
						maxLength={11}
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


				<ImageSelector propSetImage={(setImageString)}/>
			
		</ProfileContainer>
	);
}
