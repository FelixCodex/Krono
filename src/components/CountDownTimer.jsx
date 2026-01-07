/* eslint-disable react/prop-types */
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCard } from '../hooks/useCard.jsx';
import { formatNumber, oneHour, oneMin } from '../utils/utils.js';

export function CountDownTimer({ type }) {
	const { countDownTime, setCountDownTime, countDownActivatedState } =
		useCard();
	let typeAmount = 0;
	let timeAmount = 0;
	switch (type) {
		case 'hour':
			typeAmount = countDownTime / oneHour;
			timeAmount = oneHour;
			break;
		case 'min':
			typeAmount = (countDownTime % oneHour) / oneMin;
			timeAmount = oneMin;
			break;
		case 'sec':
			typeAmount = (countDownTime % oneMin) / 1000;
			timeAmount = 1000;
			break;
	}
	const timeText = formatNumber(Math.floor(typeAmount));

	return (
		<div className='flex items-center justify-center gap-1 flex-col'>
			<button
				className={`p-1 ${countDownActivatedState ? 'hidden' : 'flex'}`}
				onClick={() => {
					setCountDownTime(countDownTime + timeAmount);
				}}
			>
				<ChevronUp />
			</button>
			<span className={`font-medium text-5xl`}>{timeText}</span>
			<button
				className={`p-1 ${countDownActivatedState ? 'hidden' : 'flex'}`}
				onClick={() => {
					const updatedTime = countDownTime - timeAmount;
					if (updatedTime <= 0) {
						setCountDownTime(0);
						return;
					}
					setCountDownTime(updatedTime);
				}}
			>
				<ChevronDown />
			</button>
		</div>
	);
}
