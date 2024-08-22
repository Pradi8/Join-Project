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

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

