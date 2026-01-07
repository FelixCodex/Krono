import { createContext, useReducer, useRef, useState } from 'react';
import { cardInitialState, cardReducer } from '../reducers/card.js';

export const hourFeeInitialState = localStorage.getItem('hourFee') || 0;

export const mailInitialState = localStorage.getItem('mailToSend') || 0;

export const currentProjectInitialState =
	localStorage.getItem('currentProject') || null;

export const CardContext = createContext();

function useCardReducer() {
	const [state, dispatch] = useReducer(cardReducer, cardInitialState);
	const [currentProject, setCurrentProjectValue] = useState(
		currentProjectInitialState
	);
	const [resumedId, setResumedId] = useState(null);
	const [initialTime, setInitialTime] = useState(0);
	const [intervalTimer, setIntervalTimer] = useState(null);
	const [hourFee, setHourFeeValue] = useState(hourFeeInitialState);
	const [mail, setMailValue] = useState(mailInitialState);
	const [countDownTime, setCountDownTime] = useState(0);

	const countDownActivated = useRef(false);
	const [countDownActivatedState, setCountDownActivatedState] = useState(false);

	// Keep a mutable ref for timer logic and a state value to trigger UI updates.
	const setCountDownActivated = value => {
		if (typeof value === 'boolean') {
			countDownActivated.current = value;
			setCountDownActivatedState(value);
		} else {
			countDownActivated.current = !countDownActivated.current;
			setCountDownActivatedState(countDownActivated.current);
		}
	};

	const activated = useRef(false);
	const timerStateRef = useRef({
		isResumed: false,
		resumedCardId: 0,
		startTimestamp: 0,
	});

	const addNewProject = product =>
		dispatch({
			type: 'ADD_NEW_PROJECT',
			payload: product,
		});

	const addCardToProject = product =>
		dispatch({
			type: 'ADD_TO_PROJECT',
			payload: product,
		});

	const deleteProject = product =>
		dispatch({
			type: 'REMOVE_PROJECT',
			payload: product,
		});

	const removeCardFromProject = product =>
		dispatch({
			type: 'REMOVE_FROM_PROJECT',
			payload: product,
		});

	const updateCardFromProject = product =>
		dispatch({
			type: 'UPDATE_CARD_FROM_PROJECT',
			payload: product,
		});

	const updateProject = product =>
		dispatch({
			type: 'UPDATE_PROJECT',
			payload: product,
		});

	const repositionCardFromProject = product =>
		dispatch({
			type: 'REPOSITION_CARD_FROM_PROJECT',
			payload: product,
		});

	const setHourFee = value => {
		setHourFeeValue(value);
		localStorage.setItem('hourFee', value);
	};

	const setCurrentProject = value => {
		setCurrentProjectValue(value);
		localStorage.setItem('currentProject', value);
	};

	const setMail = value => {
		setMailValue(value);
		localStorage.setItem('mailToSend', value);
	};

	return {
		state,
		addNewProject,
		updateProject,
		addCardToProject,
		deleteProject,
		removeCardFromProject,
		updateCardFromProject,
		repositionCardFromProject,
		currentProject,
		setCurrentProject,
		activated,
		resumedId,
		setResumedId,
		initialTime,
		setInitialTime,
		intervalTimer,
		setIntervalTimer,
		hourFee,
		setHourFee,
		setMail,
		mail,
		countDownTime,
		setCountDownTime,
		countDownActivated,
		// state to trigger UI updates when count down is toggled
		countDownActivatedState,
		// setter that keeps ref and state in sync
		setCountDownActivated,
		timerStateRef,
	};
}

// eslint-disable-next-line react/prop-types
export function CardProvider({ children }) {
	const reducer = useCardReducer();

	return (
		<CardContext.Provider
			value={{
				cards: reducer.state,
				...reducer,
			}}
		>
			{children}
		</CardContext.Provider>
	);
}
