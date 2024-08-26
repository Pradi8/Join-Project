let currentTasks = [];
let chosenTaskStatus;

async function loadTasks() {
  loadUser();
  currentTasks = [];
  let errorCount = 0
  try {
    let taskResponse = await fetch(BOARD_URL + userId + ".json");
    let tasksToJson = await taskResponse.json();
    Object.keys(tasksToJson).forEach((key) => {
      let currentTaskContents = {
        taskId: key,
        taskAssignedTo: tasksToJson[key].assignedTo,
        taskCategory: tasksToJson[key].category,
        taskDescription: tasksToJson[key].description,
        taskDueDate: tasksToJson[key].dueDate,
        taskPrio: tasksToJson[key].prio,
        taskStatus: tasksToJson[key].taskStatus,
        taskTitle: tasksToJson[key].title,
        taskSubtasks: tasksToJson[key].subtasks,
      };
      currentTasks.push(currentTaskContents);
    });
  } catch (error) {
    if(errorCount = 10){
      return
    }
    loadTasks();
    errorCount++;
  }
  clearTasks();
  console.log(currentTasks);
}

function clearTasks(){
  let taskStatus = ["Todo","InProgress","Feedback","Done"]
  taskStatus.forEach(element => {
    document.getElementById("cards"+element).innerHTML="";
    document.getElementById("no"+element).classList.add("no-tasks")
  });
  showTasks();
}

function showTasks() {
  for (let i = 0; i < currentTasks.length; i++) {
    let statusTask = currentTasks[i].taskStatus;
    let taskId = 'cards' + statusTask;
    let card = document.getElementById(taskId);
    card.innerHTML += cardContentHtml(i);
    document.getElementById("no"+statusTask).classList.remove("no-tasks")
  }
}

function getprio(i) {
  let currentPrio = currentTasks[i].taskPrio;
  let prio = null;
  Object.entries(currentPrio).forEach(([key, value]) => {
    if (value) {
      prio = key;
    }
  });
  return prio;
}

function cardContentHtml(i) {
  return /* html */ `
   <button class="board-content" draggable="true" ondragstart="drag(event)" id="${currentTasks[i].taskId}">
                <div class="category">${currentTasks[i].taskCategory}</div>
                <div class="title">${currentTasks[i].taskTitle}</div>
                <div class="description">${currentTasks[i].taskDescription}</div>
                <div class="subtasks-progress">${loadSuptaskStatus(i)}</div>
                <div class="contact-line">
                  <div class="board-contacts" id="boardContacts${i}">
                   ${cardContacts(i)}
                  </div>
                  <div id="urgentStatus">
                    <img src="./img/prio_${getprio(i)}.png" alt="" />
                  </div>
                </div>
              </button>
  `;
}

function loadSuptaskStatus(i) {
  let subtask = currentTasks[i].taskSubtasks;
  if (!subtask) {
    return ``;
  } else {
    return /* html */ `
        <div class="progressbar-status">
            <progress id="file${i}" value="1" max="${subtask.length}"></progress>
          	<label for="file${i}">1/${subtask.length} Subtasks</label>
        </div>`;
  }
}

function cardContacts(i) {
  let assignedContacts = currentTasks[i].taskAssignedTo;
  let contactHTML = "";
  Object.values(assignedContacts).forEach((key) => {
    let initials = getShortcut(key);
    contactHTML += /* html */ `<div class="shortcut bg-0">${initials}</div>`;
  });
  return contactHTML;
}

function getShortcut(name) {
  let shortcut = "";
  let words = name.split(" ");
  if (words.length > 0) {
    shortcut += words[0].charAt(0).toUpperCase();
    if (words.length > 1) {
      shortcut += words[words.length - 1].charAt(0).toUpperCase();
    }
  }
  return shortcut;
}

function openBoardPopup(taskStatus) {
  document.getElementById("addTaskBoard").classList.add("edit-new-task");
  chosenTaskStatus = taskStatus;
  taskPrioMedium()
}

function closeBoardPopup() {
  document.getElementById("addTaskBoard").classList.remove("edit-new-task");
  loadTasks()
}

function openAddTask(){
  window.location.href = "add_task.html";
}

// Funktion wird aufgerufen, wenn ein Drag-Vorgang beginnt
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.transform = "rotate(20deg)";
}

// Funktion erlaubt das Ablegen des Elements
function allowDrop(event) {
  event.preventDefault();
}

// Funktion wird aufgerufen, wenn das Element abgelegt wird
function drop(event, id) {
  event.preventDefault();
  let data = event.dataTransfer.getData("text");
  let element = document.getElementById(data);
  let taskContainer = event.target.closest(".task");
  let targetContainer = taskContainer.querySelector(".aktiv-tasks");
  let noTask = document.getElementById(id);
  targetContainer.appendChild(element);
  element.style.transform = "rotate(0deg)";
  if (targetContainer) {
    noTask.classList.remove("no-tasks");
  }
}
// das is noch schrott
function checkChange(id, task) {
  let noTasks = document.getElementById(task);
  console.log(document.getElementById(id).innerHTML);
  if (id.innerHTML === "") {
    noTasks.classList.add("no-tasks");
  }
}