import { moveElement } from '../utils/utils.js';

export const cardInitialState = JSON.parse(localStorage.getItem('cards')) || [];

export const updateLocalStorage = state => {
	localStorage.setItem('cards', JSON.stringify(state));
};

export const cardReducer = (state, action) => {
	const { type: actionType, payload: actionPayload } = action;
	switch (actionType) {
		case 'ADD_NEW_PROJECT': {
			const newState = [
				{
					...actionPayload,
					projectCards: [],
				},
				...state,
			];
			updateLocalStorage(newState);
			return newState;
		}
		case 'ADD_TO_PROJECT': {
			const { projectId, cardData } = actionPayload;
			const projectIndex = state.findIndex(item => item.id == projectId);
			const newState = structuredClone(state);
			newState[projectIndex].projectCards = [
				{
					...cardData,
				},
				...newState[projectIndex].projectCards,
			];
			updateLocalStorage(newState);
			return newState;
		}
		case 'REMOVE_PROJECT': {
			const { projectId } = actionPayload;
			const newState = state.filter(item => item.id != projectId);
			updateLocalStorage(newState);
			return newState;
		}
		case 'REMOVE_FROM_PROJECT': {
			const { projectId, id } = actionPayload;
			const projectIndex = state.findIndex(item => item.id == projectId);
			const newState = structuredClone(state);
			newState[projectIndex].projectCards = newState[
				projectIndex
			].projectCards.filter(item => item.id != id);
			updateLocalStorage(newState);
			return newState;
		}
		case 'UPDATE_CARD_FROM_PROJECT': {
			const { projectId, id, time, title, color, check } = actionPayload;
			const projectIndex = state.findIndex(item => item.id == projectId);
			const newState = structuredClone(state);
			const cardIndex = newState[projectIndex].projectCards.findIndex(
				item => item.id == id
			);
			if (cardIndex == -1) return state;

			if (time) newState[projectIndex].projectCards[cardIndex].dateinfo = time;

			if (title) newState[projectIndex].projectCards[cardIndex].title = title;

			if (color) newState[projectIndex].projectCards[cardIndex].color = color;

			if (check) {
				const checked = newState[projectIndex].projectCards[cardIndex].checked;
				newState[projectIndex].projectCards[cardIndex].checked =
					checked == null ? true : !checked;
			}

			updateLocalStorage(newState);
			return newState;
		}
		case 'UPDATE_PROJECT': {
			const { projectId, title, color, check } = actionPayload;
			const projectIndex = state.findIndex(item => item.id == projectId);
			const newState = structuredClone(state);
			if (projectIndex == -1) return state;

			if (title) newState[projectIndex].title = title;

			if (color) newState[projectIndex].color = color;

			if (check) {
				const checked = newState[projectIndex].checked;
				newState[projectIndex].checked = checked == null ? true : !checked;
			}

			updateLocalStorage(newState);
			return newState;
		}
		case 'REPOSITION_CARD_FROM_PROJECT': {
			const { projectId, fromId, toId } = actionPayload;
			const projectIndex = state.findIndex(item => item.id == projectId);
			const newState = structuredClone(state);
			const fromCardIndex = newState[projectIndex].projectCards.findIndex(
				item => item.id == fromId
			);
			const toCardIndex = newState[projectIndex].projectCards.findIndex(
				item => item.id == toId
			);

			newState[projectIndex].projectCards = moveElement(
				newState[projectIndex].projectCards,
				fromCardIndex,
				toCardIndex
			);

			updateLocalStorage(newState);
			return newState;
		}
	}
	return state;
};
