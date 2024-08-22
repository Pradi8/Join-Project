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
  var data = event.dataTransfer.getData("text");
  var element = document.getElementById(data);
  
  // Finde das nächstgelegene übergeordnete Element mit der Klasse 'task'
  var taskContainer = event.target.closest('.task');
  
  // Finde die Div mit der Klasse 'aktiv-tasks' innerhalb des taskContainer
  var targetContainer = taskContainer.querySelector('.aktiv-tasks');
  
  // Füge das gezogene Element in die 'aktiv-tasks'-Div ein
  targetContainer.appendChild(element);
}
