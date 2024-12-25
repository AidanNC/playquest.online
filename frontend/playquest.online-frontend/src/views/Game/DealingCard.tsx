import styled from "styled-components";
import { FaceDownCard } from "../../components/CardComponent";
import { useEffect, useState } from "react";

export const MOVE_DURATION = 400;

const AnimatedCard = styled.div<{ $x: number; $y: number; $animate: boolean }>`
	position: absolute;
	${(props) =>
		props.$animate ? `transition: transform .4s ease;` : `transition: none;`}
	transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);
`;

type Props = {
	numCards: number;
	coordinates: { x: number; y: number }[];
	dealerIndex: number;
	incrementCard: (index: number, value: number) => void;
};
export default function DealingCard({
	numCards,
	coordinates,
	dealerIndex,
	incrementCard,
}: Props) {
	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const baseLocation = coordinates[dealerIndex];
	const [coords, setCoords] = useState(baseLocation);
	const [coords2, setCoords2] = useState(baseLocation);

	useEffect(() => {
		if (coordinates.length === 0) return;
		async function dealCard() {
			let orbit = 0;
			for (let i = 0; i < numCards; i++) {
				if (i % 2 === 0) {
					setCoords(baseLocation);
				} else {
					setCoords2(baseLocation);
				}

				await sleep(100);

				const dex = (dealerIndex + 1 + i) % coordinates.length;
				let x = coordinates[dex].x;
				if (dex === dealerIndex) {
					x -= 60;
				}
				const y = coordinates[dex].y;
				if (i % 2 === 0) {
					setCoords({ x, y });
				} else {
					setCoords2({ x, y });
				}
				await sleep(200);
				if (dex === dealerIndex) {
					orbit++;
				}
				incrementCard(dex, orbit);
			}
		}
		dealCard();
	}, []);
	return (
		<div>
			<AnimatedCard $x={baseLocation.x} $y={baseLocation.y} $animate={false}>
				<FaceDownCard onClick={null}/>
			</AnimatedCard>
			<AnimatedCard
				$x={coords.x}
				$y={coords.y}
				$animate={coords.x !== baseLocation.x || coords.y !== baseLocation.y}
				// $animate={true}
			>
				<FaceDownCard onClick={null}/>
			</AnimatedCard>
			<AnimatedCard
				$x={coords2.x}
				$y={coords2.y}
				$animate={coords2.x !== baseLocation.x || coords2.y !== baseLocation.y}
				// $animate={true}
			>
				<FaceDownCard onClick={null}/>
			</AnimatedCard>
		</div>
	);
}
