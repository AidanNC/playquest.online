import styled, { css, keyframes } from "styled-components";
import { useEffect, useState } from "react";
const gradientAnimation = keyframes`
  0% {
    background-position:0% 50%;
  }
  50% {
    background-position:100% 50%;
  }
  100% {
    background-position:0% 50%;
  }
`;
const animation = css`
	${gradientAnimation} 6s linear infinite;
	// animation-timing-function: steps(5, end);
`;
const MainContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
	// overflow: hidden;
`;
const FullScreen = styled.div`
	position: absolute;
	height: 200svh;
	width: 100vw;
	background: linear-gradient(130deg, var(--main-pink), var(--main-yellow));
	background-size: 200% 200%;
	animation: ${animation};
	overflow: hidden;
`;
const COLORS = ["#1e83c7", "#e67529", "#29e639", "#6229e6", "#87181c"];

export default function TodoModal() {
	const numcols = 10;
	const numrows = 20;
	const rows = [];
	// const colors = ["red", "green", "green"];

	// for (let i = 0; i < numrows; i++) {
	// 	for (let j = 0; j < numcols; j++) {
	// 		const top = ydist * i;
	// 		const left = 4 * j;

	// 		rows.push(
	// 			<Tile top={`${top}rem`} left={`${left}rem`} color={colors[i]} />
	// 		);
	// 	}
	// }
	for (let i = 0; i < numcols; i++) {
		const row = [];
		for (let j = 0; j < numrows; j++) {
			row.push(
				// <Tile
				// 	key={`${i}-${j}`}
				// 	$color={(j + i) % 2 === 0 ? COLORS[4] : COLORS[3]}
				// 	// $color={colors[Math.floor(Math.random() * colors.length)]}
				// 	$delay={Math.random() * 6}
				// 	$opacity={Math.random() / 2}
				// />
				<RandomTile key={`${i}-${j}`} />
			);
		}
		rows.push(<Row key={`${i}-`}>{row}</Row>);
	}

	return (
		<MainContainer>
			<FullScreen>
				<TileContainer>{rows}</TileContainer>
			</FullScreen>
		</MainContainer>
	);
}

const angle = 45;

const maxOpacity = 0.6;
const minOpacity = 0.3;
const opacityAnimation = keyframes`
	0% {
    	opacity: ${minOpacity}
	}	
	25% {
    	opacity: ${(maxOpacity - minOpacity) / 2 + minOpacity}
  	}
	50% {
		opacity: ${maxOpacity}
 	}
	75% {
		opacity:${(maxOpacity - minOpacity) / 2 + minOpacity}
  	}	
	100% {
     	opacity: ${minOpacity}
  	}
`;

const Tile = styled.div.attrs<{
	$color: string;
	$delay: number;
	$opacity: number;
}>((props) => ({
	style: {
		backgroundColor: props.$color,
		animationDelay: `${props.$delay}s`,
		opacity: props.$opacity,
	},
}))<{ $color: string; $delay: number }>`
	height: 8rem;
	width: 15rem;
	opacity: 0.5;
	// outline: 1px solid black;
	// animation: ${opacityAnimation} 6s linear infinite;
	// transition: opacity 5s, background-color 5s;
`;
const Row = styled.div`
	display; flex;
`;
const TileContainer = styled.div`
	height: 100vh;
	width: 100vw;
	// background-color: black;
	display: flex;
	-webkit-transform: rotate(${angle}deg);
	-ms-transform: rotate(${angle}deg);
	transform: rotate(${angle}deg);
	position: absolute;
	top: -50%;
`;

function RandomTile() {
	const [color, setColor] = useState<string>("#000000");
	const [opacity, setOpacity] = useState<number>(0.5);

	function randomize() {
		setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
		// setDelay(Math.random() * 6);
		setOpacity(Math.random() / 2);
	}

	useEffect(() => {
		randomize();
		// const interval = setInterval(() => {
		// 	randomize();
		// }, Math.random() * 10000 + 10000);
		// return () => clearInterval(interval);
	}, []);
	return <Tile $color={color} $delay={0} $opacity={opacity} />;
}
