import "./App.css";
import "./Modal.css";
import { useRef, useState } from "react";
import { useCard } from "./hooks/useCard.jsx";
import { useTimer } from "./hooks/useTimer.jsx";
import { BARS_ICON, PLUS_ICON, X_ICON } from "./icons/icons.jsx";
import { ProjectCard } from "./components/ProjectCard.jsx";
import { Card } from "./components/Card.jsx";
import {
  formatMillisToAdjustedHMS,
  handleToggleModal,
  openModalWithPreset,
} from "./utils/utils.js";

function App() {
  const cardId = useRef(0);

  const {
    cards,
    addNewProject,
    currentProject,
    updateProjectTitle,
    renameCardFromProject,
  } = useCard();
  const { activated, timerClick } = useTimer();
  const [projectsOpen, setProjectsOpen] = useState(false);

  const addProjectInput = useRef();

  const handleModal = () => {
    openModalWithPreset({ type: "add" });
  };

  const handleClickProject = () => {
    if (addProjectInput.current.value == "") {
      return;
    }
    const button = document.getElementById("projectButton");

    switch (button.dataset.type) {
      case "edit": {
        updateProjectTitle({
          projectId: button.dataset.id,
          title: addProjectInput.current.value,
        });
        addProjectInput.current.value = "";
        break;
      }
      case "add": {
        const id = Math.floor(Math.random() * 10000);
        const title = addProjectInput.current.value;
        addNewProject({ id, title });
        addProjectInput.current.value = "";
        break;
      }
      case "update": {
        renameCardFromProject({
          id: button.dataset.id,
          projectId: currentProject,
          title: addProjectInput.current.value,
        });
        addProjectInput.current.value = "";
        break;
      }
    }

    handleToggleModal();
  };

  return (
    <>
      <div
        className="modal-container"
        id="modalContainer"
        style={{ display: "none" }}
      >
        <div className="modal">
          <h2 className="modal-title" id="projectTitle">
            Proyecto
          </h2>
          <input
            ref={addProjectInput}
            type="text"
            placeholder="Nombre del projecto"
            className="modal-input counterInput"
            id="projectInput"
          />
          <button className="modal-btn" onClick={handleToggleModal}>
            Atras
          </button>
          <button
            className="modal-btn add-btn"
            id="projectButton"
            onClick={handleClickProject}
            data-type="add"
          >
            Agregar
          </button>
        </div>
      </div>
      <button className="projects-toggle" onClick={() => setProjectsOpen(true)}>
        <BARS_ICON></BARS_ICON>
      </button>
      <main className="main">
        <aside
          className={`input-container input-container-left ${
            projectsOpen ? "opened" : ""
          }`}
        >
          <p className="top-input-container-text">PROYECTOS</p>
          <div className="projects">
            {cards.length > 0 ? (
              cards.map(({ title, id, projectCards }) => (
                <ProjectCard
                  key={`r-${(cardId.current += 1)}`}
                  id={id}
                  className={id == currentProject ? "selected" : ""}
                  title={title}
                  setProjectsOpen={setProjectsOpen}
                  totalTime={formatMillisToAdjustedHMS(
                    projectCards.reduce(
                      (sum, item) => sum + Number(item.dateinfo),
                      0
                    )
                  )}
                ></ProjectCard>
              ))
            ) : (
              <div>No tienes proyectos</div>
            )}
          </div>
          <button
            className="toggle-projects add-project"
            onClick={() => setProjectsOpen(false)}
          >
            <X_ICON></X_ICON>
          </button>
          <button className="close-btn add-project" onClick={handleModal}>
            <PLUS_ICON></PLUS_ICON>
          </button>
        </aside>
        <main className="card-container">
          <div
            className="actual-project-label-container"
            style={currentProject ? { display: "flex" } : { display: "none" }}
          >
            <p className="actual-project-label">
              {currentProject ? (
                cards.map((item) => {
                  if (item.id == currentProject) {
                    return item.title;
                  }
                })
              ) : (
                <></>
              )}
            </p>
          </div>
          {currentProject ? (
            cards.map((item) => {
              if (item.id == currentProject) {
                return item.projectCards.length > 0 ? (
                  item.projectCards.map(({ id, title, dateinfo }) => {
                    return (
                      <Card
                        key={`r-${(cardId.current += 1)}`}
                        id={id}
                        title={title}
                        dateinfo={dateinfo}
                      ></Card>
                    );
                  })
                ) : (
                  <div key="no-notes" style={{ fontSize: "24px" }}>
                    No hay ninguna nota
                  </div>
                );
              }
            })
          ) : (
            <div style={{ fontSize: "24px" }}>Selecciona un projecto</div>
          )}
        </main>
        <aside className="input-container  input-container-right">
          <p className="message-log" id="message-log"></p>
          <input
            type="text"
            placeholder="¿En qué estas trabajando?"
            className="counterInput"
            id="counterInput"
          />
          <p className="counterText" id="counterText">
            00:00:00
          </p>
          <button
            onClick={timerClick}
            className="activateBtn"
            style={
              activated == true || activated == null
                ? { background: "#4F46E5" }
                : {}
            }
          >
            {activated == true || activated == null ? "Detener" : "Iniciar"}
          </button>
        </aside>
      </main>
    </>
  );
}

export default App;
