import {
  counterInput,
  counterText,
  formatNumber,
  oneDay,
  oneHour,
  oneMin,
  setCounterInput,
  setcounterText,
  showMessage,
} from "../utils/utils.js";
import { useCard } from "./useCard.jsx";

let intervalNextSaveTime = 0;
let intervalNextSaveTimePassed = 0;
let intervalNextSaveResumed = false;
let intervalNextSaveResumedId = 0;

export function useTimer() {
  const {
    addCardToProject,
    updateCardFromProject,
    activated,
    setActivated,
    resumedId,
    setResumedId,
    initialTime,
    setInitialTime,
    intervalTimer,
    setIntervalTimer,
    currentProject,
  } = useCard();

  const saveTimer = () => {
    console.log(intervalNextSaveResumed);
    if (intervalNextSaveResumed == false) {
      console.log("false");
      const actualDate = new Date();
      const time = actualDate.getTime() - intervalNextSaveTimePassed;

      const title = counterInput().value;
      const id = Math.floor(Math.random() * 10000);

      addCardToProject({
        projectId: currentProject,
        cardData: { id, title, dateinfo: time },
      });
      intervalNextSaveResumed = true;
      intervalNextSaveResumedId = id;
    } else if (intervalNextSaveResumed == true) {
      const actualDate = new Date().getTime();
      const time = actualDate - intervalNextSaveTimePassed;

      console.log(time);

      updateCardFromProject({
        projectId: currentProject,
        id: intervalNextSaveResumedId,
        time,
      });
    }
  };

  const handleInterval = (initialTime) => {
    const actualDate = new Date();
    const time = actualDate.getTime() - initialTime;

    let hours = Math.floor((time % oneDay) / oneHour);
    let minutes = Math.floor((time % oneHour) / oneMin);
    let segs = Math.floor((time % oneMin) / 1000);

    hours = formatNumber(hours);
    minutes = formatNumber(minutes);
    segs = formatNumber(segs);

    if (time > intervalNextSaveTime) {
      saveTimer();
      intervalNextSaveTime = time + 20000;
      console.log("GUARDADO");
    }

    counterText().textContent = `${hours}:${minutes}:${segs}`;
  };

  const timerClick = () => {
    if (counterInput().value == "") {
      showMessage("Pon un titulo");
      return;
    }

    if (currentProject == null) {
      showMessage("Selecciona un projecto");
      return;
    }

    if (activated == true) {
      console.log("activated true");
      const actualDate = new Date();
      const time = actualDate.getTime() - initialTime;

      const title = counterInput().value;
      const id = Math.floor(Math.random() * 10000);

      setInitialTime(0);
      setActivated(false);
      clearInterval(intervalTimer);

      if (!intervalNextSaveResumed) {
        addCardToProject({
          projectId: currentProject,
          cardData: { id, title, dateinfo: time },
        });
      } else {
        updateCardFromProject({
          projectId: currentProject,
          id: intervalNextSaveResumedId,
          time,
        });
      }

      setCounterInput("");
      setcounterText(`00:00:00`);
      counterInput().disabled = false;
      intervalNextSaveResumedId = 0;
      intervalNextSaveResumed = false;
      intervalNextSaveTimePassed = 0;
      intervalNextSaveTime = 0;
    } else if (activated == null) {
      console.log("activated null");
      const actualDate = new Date();
      const time = actualDate.getTime() - initialTime;

      updateCardFromProject({
        projectId: currentProject,
        id: resumedId,
        time,
      });

      setInitialTime(0);
      setActivated(false);
      clearInterval(intervalTimer);
      setResumedId(null);

      counterInput().value = "";
      counterText().textContent = `00:00:00`;
      counterInput().disabled = false;
      intervalNextSaveResumedId = 0;
      intervalNextSaveResumed = false;
      intervalNextSaveTimePassed = 0;
      intervalNextSaveTime = 0;
    } else if (activated == false) {
      console.log("activated false");
      const date = new Date().getTime();
      setInitialTime(date);
      setActivated(true);
      counterInput().disabled = true;
      intervalNextSaveResumed = false;
      intervalNextSaveTimePassed = date;
      setIntervalTimer(setInterval(() => handleInterval(date), 1000));
    }
  };

  const resumeClick = ({ time, id, title }) => {
    const date = new Date().getTime() - time;
    setInitialTime(date);
    setActivated(null);
    counterInput().disabled = true;
    counterInput().value = title;
    setResumedId(id);
    intervalNextSaveResumed = true;
    intervalNextSaveResumedId = id;
    intervalNextSaveTimePassed = date;
    setIntervalTimer(setInterval(() => handleInterval(date), 1000));
  };

  return {
    activated,
    timerClick,
    resumeClick,
  };
}
