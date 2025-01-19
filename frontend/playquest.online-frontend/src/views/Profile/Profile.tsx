import ImageSelector from "../../components/ImageSelector";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImage from "../../components/ProfileImage";
import { getStats } from "../../utils/backend";

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
	const [stats, setStats] = useState({ highScore: -1, averageScore: -1 });
	function handleSave() {
		localStorage.setItem("imageString", imageString);
	}
	useEffect(() => {
		getStats().then((data) => {
			console.log(data);
			setStats(data);
		});
	}, []);

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
				<div>
					<h2>Stats</h2>
					<p>High Score: {stats.highScore}</p>
					<p>Average Score: {stats.averageScore}</p>
				</div>
			)}

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
