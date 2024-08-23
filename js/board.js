let currentTasks = [];
let choosenTaskStatus;

async function loadTasks() {
  loadUser();
  currentTasks = [];
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
        taskSubtasks : tasksToJson[key].subtasks
      };
      currentTasks.push(currentTaskContents);
    });
  } catch (error) {
    loadTasks();
  }
  showTasks()
  console.log(currentTasks);
}

function showTasks(){
  for (let i = 0; i < currentTasks.length; i++) {
    let statusTask = currentTasks[i].taskStatus;
    let taskId = 'cards'+ statusTask
    console.log(taskId);
    let card = document.getElementById(taskId);
    card.innerHTML += cardContentHtml(i); 
  }
}

function cardContentHtml(i){
  return /* html */ `
   <button class="board-content" draggable="true" ondragstart="drag(event)" id="${currentTasks[i].taskId}">
                <div class="category">${currentTasks[i].taskCategory}</div>
                <div class="title">${currentTasks[i].taskTitle}</div>
                <div class="description">
                  ${currentTasks[i].taskDescription}
                </div>
                <div class="subtasks-progress">
                  <div class="progressbar-status">
                    <progress id="file" value="50" max="100"></progress>
                    <label for="file">1/${currentTasks[i].taskSubtasks.length} Subtasks</label>
                  </div>
                </div>
                <div class="contact-line">
                  <div class="board-contacts" id="boardContacts${i}">
                   ${cardContacts(i)}
                  </div>
                  <div id="urgentStatus">
                    <img src="./img/prio_medium_orange.png" alt="" />
                  </div>
                </div>
              </button>
  `
}

function cardContacts(i){
let cardContacts = currentTasks[i].taskAssignedTo
for (let j = 0; j < cardContacts.length; j++) {
  let contact = cardContacts[j];
  let initials = getShortcut(contact)
  document.getElementById('boardContacts${i}').innerHTML += /* html */ `<div class="shortcut bg-${j}">${initials}</div>`
}
}

function openBoardPopup(taskStatus) {
  document.getElementById("addTaskBoard").classList.add("edit-new-task");
  choosenTaskStatus = taskStatus;
}

function closeBoardPopup() {
  document.getElementById("addTaskBoard").classList.remove("edit-new-task");
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
function showTest() {
  console.log(document.getElementById("cardsInProgress").innerHTML);
}
