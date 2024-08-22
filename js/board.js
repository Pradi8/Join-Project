function createTask() {
  return {
    title: [],
    description: [],
    assignedTo: [],
    dueDate: [],
    prio: {
      urgent: false,
      medium: false,
      low: false,
    },
    category: [],
    subtasks: [],
  };
}


// Funktion wird aufgerufen, wenn ein Drag-Vorgang beginnt
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

// Funktion erlaubt das Ablegen des Elements
function allowDrop(event) {
  event.preventDefault();
}

// Funktion wird aufgerufen, wenn das Element abgelegt wird
function drop(event) {
  event.preventDefault();
  let data = event.dataTransfer.getData("text");
  let element = document.getElementById(data);
  let taskContainer = event.target.closest('.task');
  let targetContainer = taskContainer.querySelector('.aktiv-tasks');
  targetContainer.appendChild(element);
}
