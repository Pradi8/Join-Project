let chosenCards = []
let chosenTaskStatus;
let currentTaskfield;
let errorCountBoard = 0

/**
 * This function load all tasks of the user
 * 
 * @returns this return abort the try and catch function when errorCount is 100 
 * 
 */
async function loadTasks() {
  await loadUser();
  let currentTasksAsText = localStorage.getItem("currentTasks");
  if (currentTasksAsText) {
    currentTasks = JSON.parse(currentTasksAsText);
  }
  if(userId === "guest"){
    loadTasksGuest()
    return
  }
  clearTasks();
}


function clearTasks(){
  let taskStatus = ["Todo","InProgress","Feedback","Done"]
  taskStatus.forEach(element => {
    document.getElementById("cards"+element).innerHTML="";
    document.getElementById("no"+element).classList.add("no-tasks")
  });
  loadBoardContacts();
}

async function loadBoardContacts() {
  currentContacts = [];
  try {
    let loadResponse = await fetch(CONTACT_URL + userId + ".json");
    let contactToJson = await loadResponse.json();
    Object.keys(contactToJson).forEach((key) => {
      let currentContactInformation = {
        contactId: key,
        contactName: contactToJson[key].contactName,
        contactColor: contactToJson[key].contactColor
      };
      currentContacts.push(currentContactInformation);
    });
    showTasks();
  }
  catch (error) {
    if (errorCountBoard === 10) {
     showTasks();
     return
    }
    errorCountBoard++
    loadBoardContacts()    
  }
 
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
  getSubtasksCard();
}


function getSubtasksCard(){    
    if(chosenCards.taskSubtasks && chosenCards.taskSubtasks.length > 0){
    document.getElementById('subtaskDetails').classList.remove('d_none')
    let subtaskList = document.getElementById('subtaskList')
    let chosenTask = chosenCards.taskSubtasks
   for (let i = 0; i < chosenTask.length; i++) {
      let checked = chosenTask[i].completed
      let subtaskContent = chosenTask[i].newsubtask
      subtaskList.innerHTML += showCardSubtasksHtml(i, checked, subtaskContent)
    };
  }
}

async function changeCheckedSub(checked, i){
await fetch(BOARD_URL + userId + "/" + chosenCards.taskId + "/" + "subtasks" + "/" +  i + "/" + "completed" + ".json", {
  method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checked),
  })
}
function closeDetailCard(){
  document.getElementById('detailedCard').classList.remove("detail-card")
  loadTasks();
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
  if(!assignedContacts)
  {
    return contactHTML =""
  }
  for (let i = 0; i < assignedContacts.length; i++) {
    let name = assignedContacts[i].Name;
    let color = assignedContacts[i].Color
    let initials = getShortcut(name);
    contactHTML += /* html */ `<div class="shortcut" style="background-color:${color};">${initials}</div>`;
  }
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
  loadUser();
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
  currentTasks = []
  localStorage.setItem("currentTasks", JSON.stringify(currentTasks))
  loadTasks();
}

async function deleteCard(){
  await fetch(BOARD_URL + userId + "/" + chosenCards.taskId + ".json", {
    method:"DELETE"
  })
  closeDetailCard();
}