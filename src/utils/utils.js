export const oneDay = 24 * 60 * 60 * 1000;
export const oneHour = 60 * 60 * 1000;
export const oneMin = 60 * 1000;

export function formatNumber(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}
export function formatNumberAdjusted(number) {
  if (number > 0) {
    return `${number}:`;
  }
  return "";
}

export function formatDateToYearlyTime(date) {
  let day = formatNumber(date.getDate());
  let month = formatNumber(date.getMonth() + 1);
  let year = formatNumber(date.getFullYear());
  return `${day}/${month}/${year}`;
}

export function formatDateToHoursTime(date) {
  let hours = formatNumber(date.getHours());
  let min = formatNumber(date.getMinutes());
  let sec = formatNumber(date.getSeconds());
  return `${hours}:${min}:${sec}`;
}

export function formatDateToTimePassed({ hours, minutes, segs }) {
  return `${hours}:${minutes}:${segs}`;
}

export function convertTimeInMillisToHMS(time) {
  let hours = Math.floor((time % oneDay) / oneHour);
  let minutes = Math.floor((time % oneHour) / oneMin);
  let segs = Math.floor((time % oneMin) / 1000);

  hours = formatNumber(hours);
  minutes = formatNumber(minutes);
  segs = formatNumber(segs);

  return { hours, minutes, segs };
}

export function formatMillisToAdjustedHMS(time) {
  let hours = Math.floor((time % oneDay) / oneHour);
  let minutes = Math.floor((time % oneHour) / oneMin);
  let segs = Math.floor((time % oneMin) / 1000);

  hours = formatNumberAdjusted(hours);
  segs = formatNumber(segs);

  return `${hours}${minutes}:${segs}`;
}

export function showMessage(text) {
  const messageLog = document.getElementById("message-log");
  messageLog.classList.remove("shake");
  messageLog.classList.add("shake");
  messageLog.textContent = text;
  messageLog.classList.add("red");
  setTimeout(() => {
    messageLog.textContent = "";
    messageLog.classList.remove("red");
    messageLog.classList.remove("shake");
  }, 4000);
}

export function counterInput() {
  return document.getElementById("counterInput");
}

export function setCounterInput(text) {
  document.getElementById("counterInput").value = text;
}

export function counterText() {
  return document.getElementById("counterText");
}

export function setcounterText(text) {
  document.getElementById("counterText").value = text;
}

export const handleToggleModal = () => {
  const modal = document.getElementById("modalContainer");
  if (modal.style.display == "none") {
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }
};

export const openModalWithPreset = ({ type, input, id }) => {
  const titleM = document.getElementById("projectTitle");
  const inputM = document.getElementById("projectInput");
  const buttonM = document.getElementById("projectButton");

  switch (type) {
    case "edit": {
      titleM.textContent = "Editar proyecto";
      inputM.value = input;
      inputM.placeholder = "Nombre del projecto";
      buttonM.textContent = "Editar";
      buttonM.dataset.type = "edit";
      buttonM.dataset.id = id;
      break;
    }
    case "add": {
      titleM.textContent = "Agregar nuevo proyecto";
      inputM.value = "";
      inputM.placeholder = "Nombre del projecto";
      buttonM.textContent = "Agregar";
      buttonM.dataset.type = "add";
      break;
    }
    case "update": {
      console.log("asd");
      titleM.textContent = "Editar nota";
      inputM.value = input;
      inputM.placeholder = "Nombre de la nota";
      buttonM.textContent = "Editar";
      buttonM.dataset.type = "update";
      buttonM.dataset.id = id;
      break;
    }
  }

  handleToggleModal();
};

export const moveElement = (array, fromIndex, toIndex) => {
  const newArray = [...array];
  const [movedElement] = newArray.splice(fromIndex, 1); // Remueve el elemento
  newArray.splice(toIndex, 0, movedElement); // Lo inserta en la nueva posición
  return newArray;
};

export function reduceArray() {
  const arr = [
    { dateinfo: "1328", id: "173", title: "asd" },
    { dateinfo: "1328", id: "173", title: "asd" },
    { dateinfo: "1328", id: "173", title: "asd" },
    { dateinfo: "1328", id: "173", title: "asd" },
    { dateinfo: "1328", id: "173", title: "asd" },
  ];

  const reduced = arr.reduce((sum, item) => sum + Number(item.dateinfo), 0);
  console.log(reduced);
}
