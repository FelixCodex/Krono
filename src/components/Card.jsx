import { useState } from "react";
import { useCard } from "../hooks/useCard.jsx";
import {
  convertTimeInMillisToHMS,
  formatDateToTimePassed,
  openModalWithPreset,
  showMessage,
} from "../utils/utils.js";
import { EDIT_ICON, PLAY_ICON, TRASH_ICON } from "../icons/icons.jsx";
import { useTimer } from "../hooks/useTimer.jsx";

// eslint-disable-next-line react/prop-types
export function Card({ title, dateinfo, id }) {
  const { removeCardFromProject, currentProject, repositionCardFromProject } =
    useCard();
  const [cardId] = useState(id);
  const { resumeClick } = useTimer();
  const { activated } = useCard();

  const handleClick = () => {
    const confirmAsk = confirm("Quieres eliminar esta nota?");
    if (confirmAsk)
      removeCardFromProject({ projectId: currentProject, id: cardId });
  };

  const handleResume = () => {
    if (activated == true || activated == null) {
      showMessage("Hay un cronometro activo!");
      return;
    }
    resumeClick({ time: dateinfo, id, title });
  };

  const handleEdit = () => {
    openModalWithPreset({ type: "update", input: title, id: cardId });
  };

  const handleDragStart = (e) => {
    const elemt = e.currentTarget;
    const dargPin = e.currentTarget.children[1];
    const rect = elemt.getBoundingClientRect();
    const pinRect = dargPin.getBoundingClientRect();
    const mouseOffsetX = e.clientX - rect.left;
    const mouseOffsetY = e.clientY - rect.top;
    const pinRectX = pinRect.left - rect.left;
    const pinRecY = pinRect.top - rect.top;

    const compX =
      mouseOffsetX < pinRectX || mouseOffsetX > pinRectX + pinRect.width;
    const compY =
      mouseOffsetY < pinRecY || mouseOffsetY > pinRecY + pinRect.height;

    if (compX || compY) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData("fromId", cardId);
  };

  const handleDrop = (e) => {
    const elem = e.currentTarget;
    const fromId = e.dataTransfer.getData("fromId");

    if (elem.classList.contains("card")) {
      elem.style = "border: 1px solid #444;";
    } else {
      elem.closest(".card").style = "border: 1px solid #444;";
    }
    repositionCardFromProject({
      projectId: currentProject,
      fromId,
      toId: elem.dataset.id,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const elemt = e.currentTarget;

    elemt.style = "border: 1px solid #fff;";
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style = "border: 1px solid #444;";
  };

  return (
    <>
      <div
        className="card"
        draggable={true}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-id={cardId}
      >
        <div className="card-drag-divider"></div>
        <button className="card-drag-pin" id="drag-pin"></button>
        <h2 className="card-title">{title}</h2>
        <p className="card-timeinfo">
          {formatDateToTimePassed(convertTimeInMillisToHMS(dateinfo))}
        </p>
        <div className="card-actions-divider"></div>
        <button className="edit-btn" onClick={handleEdit}>
          <EDIT_ICON></EDIT_ICON>
        </button>
        <button className="close-btn" onClick={handleClick}>
          <TRASH_ICON></TRASH_ICON>
        </button>
        <button className="play-btn" onClick={handleResume}>
          <PLAY_ICON></PLAY_ICON>
        </button>
      </div>
    </>
  );
}
