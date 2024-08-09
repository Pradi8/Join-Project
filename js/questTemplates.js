let guestDatas = [
  {
    taskStatus: "todo",
    title: "Guest tutorial task",
    description: "Here you can generate your own task",
    assignedTo: {},
    dueDate: "2024-08-07",
    prio: {
      urgent: false,
      medium: false,
      low: true,
    },
    category: "technical task",
    subtasks: {},
  },
  {
    taskStatus: "inProgress",
    title: "Guest tutorial progress",
    description:
      "you can also move the tasks to an other status if you drag and drop the card",
    assignedTo: {},
    dueDate: "",
    prio: {
      urgent: false,
      medium: true,
      low: false,
    },
    category: "technical task",
    subtasks: {},
  },
  {
    taskStatus: "Guest done",
    title: "Guest tutorial end",
    description: "",
    assignedTo: {},
    dueDate: "",
    prio: {
      urgent: true,
      medium: false,
      low: false,
    },
    category: "user task",
    subtasks: {},
  },
];

let dataGuest = {
  taskStatus: "",
  title: "",
  description: "",
  assignedTo: {},
  dueDate: "",
  prio: {
    urgent: false,
    medium: false,
    low: true,
  },
  category: "",
  subtasks: {},
};

function addGuestTaskLocal(task) {
  dataGuest.title = document.getElementById("task-title").value;
  dataGuest.description = document.getElementById("task-description").value;
  dataGuest.assignedTo = { name1: "Name1", name2: "Name2" };
  dataGuest.dueDate = document.getElementById("add-task-duo-date").value;
  dataGuest.prio.urgent = true; // hier muss noch der button abgefragt werden ist nur ein beispiel zum testen gewesen
  dataGuest.category = "testlauf";
  dataGuest.subtasks = {
    subtask1: "testlauf1",
    subtask2: "mit subtask spielen",
  };
  dataGuest.taskStatus = task;
  postDataGuest();
}

function postDataGuest() {
  /* hier muss das GastArray befüllt werden */
}
