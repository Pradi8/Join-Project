let currentTasks = [];
let chosenCards = []
let chosenTaskStatus;
let currentTaskfield;

/**
 * This function load all tasks of the user
 * 
 * @returns this return abort the try and catch function when errorCount is 100 
 * 
 */
async function loadTasks() {
  loadUser();
  if(userId === "guest"){
    loadTasksGuest()
    return
  }
  currentTasks = [];
  let errorCount = 0
  try {
    let taskResponse = await fetch(BOARD_URL + userId + ".json");
    let tasksToJson = await taskResponse.json();
    Object.keys(tasksToJson).forEach((key) => {
      let currentTaskContents = createTaskContents(key, tasksToJson[key]);
      currentTasks.push(currentTaskContents);
    });
  } catch (error) {
    if(errorCount === 100){
      return
    }
    loadTasks();
    errorCount++;
  }
  clearTasks();
}

/**
 * This function is a helpfunction to load the datas of the separate tasks
 * 
 * 
 * @param {*} key       this parameter is the key id from the task
 * @param {*} taskData  this parameter contains the task data from the database
 * @returns             return the content of the current task 
 */

function createTaskContents(key, taskData) {
  return {
    taskId: key,
    taskAssignedTo: taskData.assignedTo,
    taskCategory: taskData.category,
    taskDescription: taskData.description,
    taskDueDate: taskData.dueDate,
    taskPrio: taskData.prio,
    taskStatus: taskData.taskStatus,
    taskTitle: taskData.title,
    taskSubtasks: taskData.subtasks,
  };
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
  document.getElementById('taskStatusChange').value = chosenCards.taskStatus;
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

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.transform = "rotate(20deg)";
}

function setCurrentTask(task){
  currentTaskfield = task
 }

function allowDrop(event) {
  event.preventDefault();
}

function abord(event){
  event.target.style.transform = "rotate(0deg)";
}

function drop(event, task) {
  event.preventDefault();
  let taskId = event.dataTransfer.getData("text");
  let element = document.getElementById(taskId);
  let targetContainer = document.getElementById('cards' + task);
  targetContainer.appendChild(element);
  saveTaskDrop(taskId, task) 
}

async function saveTaskDrop(taskId, task) {
  await fetch(BOARD_URL + userId + "/" + taskId + "/" + "taskStatus" + ".json",{
    method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
  })
  changeContentDrop(task)
}


function changeContentDrop(taskFieldDrop){
  let taskLineDrop = document.getElementById('cards'+taskFieldDrop)
  let noTaskDrop = document.getElementById('no'+taskFieldDrop)
  if(taskLineDrop.innerHTML.trim() == ""){
    noTaskDrop.classList.add('no-tasks')
    console.log("true")
  }
  else{
    noTaskDrop.classList.remove('no-tasks')
  }
  changeContentLeave()
}

function changeContentLeave(){
  let taskLine = document.getElementById('cards'+currentTaskfield)
  let noTask = document.getElementById('no'+currentTaskfield)
  if(taskLine.innerHTML.trim() == ""){
    noTask.classList.add('no-tasks')
    console.log("true")
  }
  else{
    noTask.classList.remove('no-tasks')
  }
}

async function changeStatus(){
  let changeStatusValue = document.getElementById('taskStatusChange').value
  let taskId = chosenCards.taskId;
  await fetch(BOARD_URL + userId + "/" + taskId + "/" + "taskStatus" + ".json",{
    method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changeStatusValue),
  })
  loadTasks();
}
