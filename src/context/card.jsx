import { createContext, useReducer, useState } from "react";
import { cardInitialState, cardReducer } from "../reducers/card.js";

export const CardContext = createContext();

function useCardReducer() {
  const [state, dispatch] = useReducer(cardReducer, cardInitialState);
  const [currentProject, setCurrentProject] = useState(null);
  const [activated, setActivated] = useState(false);
  const [resumedId, setResumedId] = useState(null);
  const [initialTime, setInitialTime] = useState(0);
  const [intervalTimer, setIntervalTimer] = useState(null);

  const addNewProject = (product) =>
    dispatch({
      type: "ADD_NEW_PROJECT",
      payload: product,
    });

  const addCardToProject = (product) =>
    dispatch({
      type: "ADD_TO_PROJECT",
      payload: product,
    });

  const deleteProject = (product) =>
    dispatch({
      type: "REMOVE_PROJECT",
      payload: product,
    });

  const removeCardFromProject = (product) =>
    dispatch({
      type: "REMOVE_FROM_PROJECT",
      payload: product,
    });

  const updateCardFromProject = (product) =>
    dispatch({
      type: "UPDATE_CARD_FROM_PROJECT",
      payload: product,
    });

  const renameCardFromProject = (product) =>
    dispatch({
      type: "RENAME_CARD_FROM_PROJECT",
      payload: product,
    });

  const updateProjectTitle = (product) =>
    dispatch({
      type: "UPDATE_PROJECT_TITLE",
      payload: product,
    });

  const repositionCardFromProject = (product) =>
    dispatch({
      type: "REPOSITION_CARD_FROM_PROJECT",
      payload: product,
    });

  return {
    state,
    addNewProject,
    addCardToProject,
    deleteProject,
    removeCardFromProject,
    updateCardFromProject,
    updateProjectTitle,
    renameCardFromProject,
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
  };
}

// eslint-disable-next-line react/prop-types
export function CardProvider({ children }) {
  const {
    state,
    addNewProject,
    addCardToProject,
    deleteProject,
    removeCardFromProject,
    updateCardFromProject,
    updateProjectTitle,
    renameCardFromProject,
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
  } = useCardReducer();

  return (
    <CardContext.Provider
      value={{
        cards: state,
        addNewProject,
        addCardToProject,
        deleteProject,
        removeCardFromProject,
        updateCardFromProject,
        updateProjectTitle,
        renameCardFromProject,
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
      }}
    >
      {children}
    </CardContext.Provider>
  );
}
