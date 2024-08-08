let data = {
  taskStatus: "",
  title: "",
  description: "",
  assignedTo: {},
  dueDate: "",
  prio: {
    urgent: false,
    medium: false,
    low: false,
  },
  category: "",
  subtasks: {},
};

/**
 * this function collect the task data
 * 
 * @param {string} task 
 */

function createNewTask(task) {
  if(userId === "guest"){
   return addGuestTaskLocal();
  }
  data.title = document.getElementById("task-title").value;
  data.description = document.getElementById("task-description").value;
  data.assignedTo = { name1: "Name1", name2: "Name2" };
  data.dueDate = document.getElementById("add-task-duo-date").value;  
  data.prio.urgent = true; // hier muss noch der button abgefragt werden ist nur ein beispiel zum testen gewesen
  data.category = "testlauf";
  data.subtasks = { subtask1: "testlauf1", subtask2: "mit subtask spielen" }; 
  data.taskStatus = task;
  postData(task);
}

/**
 * this function post data to database
 * 
 * @returns response.json
 */

async function postData() {
  let response = await fetch(BOARD_URL + userId + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * this function does not allow older dates
 */

document.addEventListener('DOMContentLoaded', (event) => {
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() +1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
  }
  document.getElementById('add-task-duo-date').min = getCurrentDate();
});

/**
 * 
 * this function allwow to choose between different tasks
 */

function selectCategory() {
  document.getElementById('select-task-category-img').classList.toggle('rotate-arrow');
  document.getElementById('task-subtasks').classList.toggle('d-none');
  document.getElementById('select-category').classList.toggle('d-none');
  document.getElementById('add-task-category-text').classList.toggle('shadow-box');
}

function taskPrioMedium() {
  document.getElementById('icon-medium-img').src = './img/prio_medium.png';
  document.getElementById('task-icon-medium').classList.toggle('task-icon-medium-clicked');
}