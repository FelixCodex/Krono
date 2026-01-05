import { createContext, useReducer, useState } from 'react';
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
	const [activated, setActivated] = useState(false);
	const [resumedId, setResumedId] = useState(null);
	const [initialTime, setInitialTime] = useState(0);
	const [intervalTimer, setIntervalTimer] = useState(null);
	const [hourFee, setHourFeeValue] = useState(hourFeeInitialState);
	const [mail, setMailValue] = useState(mailInitialState);

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
		console.log(value);
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
		setActivated,
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
	};
}

// eslint-disable-next-line react/prop-types
export function CardProvider({ children }) {
	const {
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
		setActivated,
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
	} = useCardReducer();

	return (
		<CardContext.Provider
			value={{
				cards: state,
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
				setActivated,
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
			}}
		>
			{children}
		</CardContext.Provider>
	);
}
