import styled from "styled-components";
import ModalContainer from "../../components/ModalContainer";

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	// align-items: center;
	gap: 20px;
	padding: 20px;
	height: 70svh;
	// width: 50%;
	text-align: center;
`;

const ScoreRow = styled.div`
	display: flex;
	gap: 20px;
	justify-content: space-evenly;
	text-align: center;

`;

const RowAndLine = styled.div`
	max-width: fit-content;
	align-items: stretch;
	flex-direction: column;
	width: auto;

`;

const ScorePiece = styled.div`
	// color: #6e0206;
	position: relative;
	text-align: center;
	display: flex;
	margin-top: 10px;
	width: 90px;
	.notFinished {
		outline: none;
	}
	.incorrect {
		outline: 3px solid #6e0206;
		border-radius: 4px;
	}
	.correct {
		outline: 3px solid #017022;
		border-radius: 4px;
	}
	.bet {
		padding-left: 0.1rem;
		font-size: 1.4rem;
		margin: 0px;
		height: 1.5rem;
	}
	.score {
		font-size: 3rem;
		margin: 0px;
		margin-left: 0.5rem;
	}
`;

const LineDivider = styled.hr`
	// width: 100%;
	width: 100%;
	border: none;
	border-top: 2px solid var(--main-dark);
	// align-self: center;
	// flex: 1;
	// flex-grow: 1;
	// flex-shrink: 1;
`;
type ViewTricksModalProps = {
	playerNames: string[];
	scoreRecord: number[][];
	betsRecord: number[][];
	onClose: () => void;
	isOpen: boolean;
};

export default function AllRoundScoreboardModal({
	playerNames,
	scoreRecord,
	betsRecord,
	onClose,
	isOpen,
}: ViewTricksModalProps) {
	// betsRecord = betsRecord ? [[0],[0],[0],[0],[0]] : betsRecord;
	// scoreRecord = scoreRecord ? [[0],[0],[0],[0],[0]] : scoreRecord;

	function isCorrect(
		bet: number,
		score: number | null,
		prevScore: number | null
	): string {
		//the round hasn't finished
		if (score === null) {
			return "notFinished";
		}
		//first round then score shoudl just be bet + 10
		if (prevScore === null && score === bet + 10) {
			return "correct";
		}
		//otherwise its wrong
		if (prevScore === null) {
			return "incorrect";
		}
		//if the score is the same as the previous score + bet + 10
		if (score === prevScore + bet + 10) {
			return "correct";
		}
		return "incorrect";
	}
	function getRoundLabel(round: number): number {
		if (round <= 9) {
			return 10 - round;
		} else {
			return round - 10 + 2;
		}
	}
	const headerRow = (
		<ScoreRow>
			<p></p>
			{playerNames.map((name, index) => {
				return <p key={index}>{name}</p>;
			})}
		</ScoreRow>
	);
	const rows = [];
	for (let i = 0; i < betsRecord.length; i++) {
		const bets = betsRecord[i];
		let scores: number[] | null[] = [null, null, null, null, null];
		let prevScores: number[] | null[] = [null, null, null, null, null];
		if (scoreRecord[i]) {
			scores = scoreRecord[i];
		}
		if (scoreRecord[i - 1]) {
			prevScores = scoreRecord[i - 1];
		}
		const row = (
			<ScoreRow key={i}>
				<p>{getRoundLabel(i)}</p>
				{bets.map((bet, index) => {
					return (
						<div key={index + 100}>
							<ScorePiece>
								<p
									className={
										isCorrect(bet, scores[index], prevScores[index]) + " bet"
									}
								>
									{bet}
								</p>
								{scores[index] && <p className="score">{scores[index]}</p>}
							</ScorePiece>
						</div>
					);
				})}
			</ScoreRow>
		);

		// rows.push(<LineDivider key={i + 200} />);
		// rows.push(row);
		rows.push(
			<RowAndLine key={i + 200}>
				<LineDivider />
				{row}
			</RowAndLine>
		);
	}

	return (
		<ModalContainer isOpen={isOpen} onClose={onClose}>
			<MainContainer>
				{headerRow}
				{rows}
			</MainContainer>
		</ModalContainer>
	);
}
