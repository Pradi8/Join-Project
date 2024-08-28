let currentTasks = [];
let chosenCards = []
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
    if(errorCount = 100){
      return
    }
    loadTasks();
    errorCount++;
  }
  clearTasks();
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

function showDetailCard(id){
  let detailsCard = document.getElementById('detailedCard')
  for (let i = 0; i < currentTasks.length; i++) {
    if(currentTasks[i].taskId === id)
    chosenCards= currentTasks[i];
  }
  let detailPrio = getPrioDetailCard()
  detailsCard.innerHTML = showDetailCardHtml(detailPrio)
  detailsCard.classList.add('detail-card')
}

function closeDetailCard(){
  document.getElementById('detailedCard').classList.remove("detail-card")
}

function getPrioDetailCard(){
    let currentPrio = chosenCards.taskPrio;
    let prio = null;
    Object.entries(currentPrio).forEach(([key, value]) => {
      if (value) {
        prio = key;
      }
    });
    return prio;
  
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
    contactHTML += /* html */ `<div class="shortcut">${initials}</div>`;
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
  let targetContainer = document.getElementById('cards' + id);
  let noTask = document.getElementById(id);
  targetContainer.appendChild(element);
  element.style.transform = "rotate(0deg)";
}
// das is noch schrott
function checkChange(id, task) {
  let noTasks = document.getElementById(task);
  console.log(document.getElementById(id).innerHTML);
  if (id.innerHTML === "") {
    noTasks.classList.add("no-tasks");
  }
}