import styled, { css, keyframes } from "styled-components";

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
	${gradientAnimation} 6s ease infinite;
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
	filter: drop-shadow(0px 0px 6px var(--main-pink));
	background: linear-gradient(130deg, var(--main-pink), var(--main-yellow));
	background-size: 200% 200%;
	animation: ${animation};
	overflow: hidden;
`;

export default function TodoModal() {

	const numcols = 20;
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
				<Tile
					key={`${i}-${j}`}
					$color={(j + i) % 2 === 0 ? "red" : "#1e83c7"}
					$delay={Math.random() * 6}
				/>
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

const opacityAnimation = keyframes`
	0% {
    	opacity: 0.2
	}	
	25% {
    	opacity: 0.4
  	}
	50% {
		opacity: 0.6
 	}
	75% {
		opacity: 0.4
  	}	
	100% {
     	opacity: 0.2
  	}
`;

const Tile = styled.div.attrs<{ $color: string; $delay: number }>((props) => ({
	style: {
		backgroundColor: props.$color,
		animationDelay: `${props.$delay}s`,
	},
}))<{ $color: string; $delay: number }>`
	height: 8rem;
	width: 15rem;
	opacity: 0.2;
	outline: 1px solid black;
	animation: ${opacityAnimation} 6s linear infinite;
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
