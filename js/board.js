let currentTasks=[];

async function loadTasks(){
  let taskResponse = await fetch(BOARD_URL + userId + ".json")
  let tasksToJson = await taskResponse.json();
  console.log(tasksToJson);
  Object.keys(tasksToJson).forEach((key) => {

  })
}

function openBoardPopup(){
  document.getElementById('addTaskBoard').classList.add('edit-new-task');
}

function closeBoardPopup(){
  document.getElementById('addTaskBoard').classList.remove('edit-new-task');
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

function checkChange(id, task) {
  let noTasks = document.getElementById(task);
  console.log(document.getElementById(id).innerHTML);
  if (id.innerHTML === "") {
    noTasks.classList.add("no-tasks");
  }
}
function showTest(){
console.log(document.getElementById('cardsInProgress').innerHTML);
}
