import ImageSelector from "../../components/ImageSelector";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImage from "../../components/ProfileImage";

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	gap: 30px;
	font-size: 20px;
	color: var(--white);
`;

const TopBar = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	gap: 20px;
`;

export default function Profile() {
	const navigate = useNavigate();
	const [editingImage, setEditingImage] = useState(false);
	const username = localStorage.getItem("username");
	const savedImageString = localStorage.getItem("imageString");
	const [imageString, setImageString] = useState(
		savedImageString ? savedImageString : "beanbag"
	);
	function handleSave() {
		localStorage.setItem("imageString", imageString);
	}

	return (
		<MainContainer>
			<TopBar>
				<button onClick={() => navigate("/")}>Back</button>
				{imageString && (
					<ProfileImage imageString={imageString} selected={false} />
				)}
				<h1>{username}</h1>
			</TopBar>

			{!editingImage && (
				<button onClick={() => setEditingImage(true)}>Edit Image</button>
			)}
			{editingImage && (
				<div>
					<ImageSelector
						propSetImage={(name) => {
							setImageString(name);
						}}
					/>
				</div>
			)}
			{editingImage && (
				<button
					onClick={() => {
						handleSave();
						setEditingImage(false);
					}}
				>
					Save
				</button>
			)}
		</MainContainer>
	);
}
