import styled from "styled-components";
import { FaceDownCard } from "../../components/CardComponent";
import { useEffect, useRef, useState } from "react";

export const MOVE_DURATION = 400;

const AnimatedCard = styled.div<{ $x: number; $y: number; $animate: boolean }>`
	position: absolute;
	${(props) =>
		props.$animate
			? `transition: transform ${MOVE_DURATION / 1000}s ease;`
			: `transition: none;`}
	transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);
	z-index: 100;
`;

type Props = {
	numCards: number;
	coordinates: { x: number; y: number }[];
	dealerPosition: number;
	dealerIndex: number;
	incrementCard: (index: number, value: number) => void;
};
export default function DealingCard({
	numCards,
	coordinates,
	dealerPosition,
	dealerIndex,
	incrementCard,
}: Props) {
	const baseLocation = coordinates[dealerPosition];
	const [coords, setCoords] = useState(baseLocation);
	const [coords2, setCoords2] = useState(baseLocation);

	const dealtCards = useRef(false);

	useEffect(() => {
		if (coordinates.length === 0) return;
		async function dealCard() {
			if (dealtCards.current) return;
			dealtCards.current = true; //because otherwise strict mode was making it run twice, its good to be safe like this
			console.log("dealer index", dealerIndex);
			console.log("dealer position", dealerPosition);
			for (let i = 0; i < numCards*2; i++) {
				setTimeout(() => {
					if (i % 2 == 0) {
						// const dex = 0;
						const dex = (dealerPosition + 1 + i/2) % coordinates.length;
						let x = coordinates[dex].x;
						const y = coordinates[dex].y;
						if (dex === dealerPosition) {
							x -= 60;
						}
						if(i % 4 === 0){
							setCoords({ x, y });
						}else{
							setCoords2({ x, y });
						}
						
						
						setTimeout(() => {
							const position = (dealerIndex + 1 + i/2) % coordinates.length;
							incrementCard(position, i/2 / coordinates.length + 1);
						}, MOVE_DURATION-70); 
						//this has to be move duration because we want the increment to synch with the card arriving 
						//we just subtract a little to make it feel a bit snappier
					} else { 
						setTimeout(() => {
							if(i % 4 === 1){
								setCoords(baseLocation);
							}else{
								setCoords2(baseLocation);
							
							}
							// setCoords(baseLocation);
						}, MOVE_DURATION); //B
					}
				}, MOVE_DURATION/2 * (i)); //Duration A
			}
			/*
			this is trying to explain for future me, basically if duration A is 1(moveduration)
			and duration b is 1(moveduration) then the sequence is like this at each time step 
			0 -> move A 
			1 -> 2 -> reset A
			2 -> move B
			3 -> 4 -> reset B
			4 -> move A
			5 -> 6 -> reset A
			6 -> move B 
			7 -> 8 -> reset B

			T:	0  1  2  3  4  5  6  7  8  
			A: 	M     R     M     R   
			B:	      M     R     M

			by setting duration A to be one half of a move we get osmething like following pattern 
			where the moves and resets overlap 
			T:	0  1  2  3  4  5  6  7  8  
			A: 	M    R    M    R   
			B:	   M   R    M
			Also we learned that using sleep can have some bad consequences if we are trying to animate
			*/
		}
		dealCard();
	}, []);
	return (
		<div>
			<AnimatedCard $x={baseLocation.x} $y={baseLocation.y} $animate={false}>
				<FaceDownCard onClick={null} />
			</AnimatedCard>
			<AnimatedCard
				$x={coords.x}
				$y={coords.y}
				$animate={coords.x !== baseLocation.x || coords.y !== baseLocation.y}
			>
				<FaceDownCard onClick={null} />
			</AnimatedCard>
			<AnimatedCard
				$x={coords2.x}
				$y={coords2.y}
				$animate={coords2.x !== baseLocation.x || coords2.y !== baseLocation.y}
			>
				<FaceDownCard onClick={null} />
			</AnimatedCard>
		</div>
	);
}
