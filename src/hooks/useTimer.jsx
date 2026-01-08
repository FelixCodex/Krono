import { useCallback } from 'react';
import {
	counterInput,
	counterText,
	oneHour,
	oneMin,
	oneSec,
	showMessage,
} from '../utils/utils.js';
import { useCard } from './useCard.jsx';

// Constantes

// Utilidades
const formatNumber = num => String(num).padStart(2, '0');

const formatTimeToCounterText = time => {
	const hours = Math.floor(time / oneHour);
	const minutes = Math.floor((time % oneHour) / oneMin);
	const seconds = Math.floor((time % oneMin) / oneSec);

	return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
		seconds
	)}`;
};

const generateId = () => Math.floor(Math.random() * 10000);

export function useTimer() {
	const {
		addCardToProject,
		updateCardFromProject,
		activated,
		setResumedId,
		currentProject,
		setCountDownTime,
		countDownActivated,
		setCountDownActivated,
		timerStateRef,
		setActivated,
		currentInterval,
	} = useCard();

	const getCounterElements = useCallback(() => {
		return {
			input: counterInput(),
			text: counterText(),
		};
	}, []);

	const resetCounterUI = useCallback(() => {
		const { input, text } = getCounterElements();
		input.value = '';
		input.disabled = false;
		text.textContent = '00:00:00';
	}, [getCounterElements]);

	const resetTimerState = useCallback(() => {
		timerStateRef.current = {
			isResumed: false,
			resumedCardId: 0,
			startTimestamp: 0,
		};
	}, [timerStateRef]);

	const saveTimer = useCallback(() => {
		const now = Date.now();
		const elapsed = now - timerStateRef.current.startTimestamp;
		const { input } = getCounterElements();
		const title = input.value;

		if (!timerStateRef.current.isResumed) {
			const id = generateId();
			addCardToProject({
				projectId: currentProject,
				cardData: { id, title, dateinfo: elapsed },
			});
			timerStateRef.current.isResumed = true;
			timerStateRef.current.resumedCardId = id;
		} else {
			updateCardFromProject({
				projectId: currentProject,
				id: timerStateRef.current.resumedCardId,
				time: elapsed,
			});
		}
	}, [
		timerStateRef,
		getCounterElements,
		addCardToProject,
		currentProject,
		updateCardFromProject,
	]);

	const stopCounting = useCallback(() => {
		// activated.current = false;
		setActivated(false);
		clearInterval(currentInterval.current);

		saveTimer();
		setResumedId(null);

		resetCounterUI();
		resetTimerState();
	}, [
		setActivated,
		currentInterval,
		saveTimer,
		setResumedId,
		resetCounterUI,
		resetTimerState,
	]);

	const handleInterval = useCallback(
		startTime => {
			if (activated.current == false) return;

			const now = Date.now();
			const elapsed = now - startTime;
			const { text } = getCounterElements();

			if (countDownActivated.current) {
				setCountDownTime(prev => {
					const updated = prev - oneSec;
					if (updated <= 0) {
						setCountDownActivated(false);
						stopCounting();
						const sound = new Audio('/call_announce.mp3');
						sound.play();
						return 0;
					}
					return updated;
				});
			}

			text.textContent = formatTimeToCounterText(elapsed);

			saveTimer();
		},
		[
			activated,
			getCounterElements,
			countDownActivated,
			saveTimer,
			setCountDownTime,
			setCountDownActivated,
			stopCounting,
		]
	);

	const timerClick = useCallback(() => {
		const { input } = getCounterElements();

		if (!currentProject) {
			showMessage('Selecciona un proyecto');
			return;
		}

		// Timer activo - detener
		if (activated.current === true) {
			stopCounting();
			return;
		}

		// Timer resumido - detener
		else if (activated.current === 'resumed') {
			stopCounting();
			return;
		}

		// Timer inactivo - iniciar
		else if (activated.current === false) {
			if (!input.value.trim()) {
				showMessage('Pon un título');
				return;
			}

			const now = Date.now();
			// activated.current = true;
			setActivated(true);
			input.disabled = true;

			timerStateRef.current.isResumed = false;
			timerStateRef.current.startTimestamp = now;

			const interval = setInterval(() => handleInterval(now), oneSec);
			currentInterval.current = interval;
		}
	}, [
		activated,
		currentInterval,
		currentProject,
		getCounterElements,
		handleInterval,
		setActivated,
		stopCounting,
		timerStateRef,
	]);

	const resumeClick = useCallback(
		({ time, id, title }) => {
			const { input, text } = getCounterElements();
			const now = Date.now();
			const startTime = now - time;

			// activated.current = 'resumed';
			setActivated('resumed');
			setResumedId(id);

			input.disabled = true;
			input.value = title;
			text.textContent = formatTimeToCounterText(time);

			timerStateRef.current.isResumed = true;
			timerStateRef.current.resumedCardId = id;
			timerStateRef.current.startTimestamp = startTime;

			const interval = setInterval(() => handleInterval(startTime), oneSec);
			currentInterval.current = interval;
		},
		[
			getCounterElements,
			setActivated,
			setResumedId,
			timerStateRef,
			currentInterval,
			handleInterval,
		]
	);

	return {
		timerClick,
		resumeClick,
	};
}
