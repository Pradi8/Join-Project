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
  loadBoardContacts();
}

/**
 * This function loads the contact list from the database contacts 
 * 
 * @returns if error count = 10 the function will stop search contacts
 */

async function loadBoardContacts() {
  currentContacts = [userAsContact()] ;
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
   clearTasks();
  }
  catch (error) {
    if (errorCountBoard === 10) {
     clearTasks();
     return
    }
    errorCountBoard++
    loadBoardContacts()    
  }
}

function userAsContact(){
  let UserInformation={
        contactId: userId,
        contactName: userName + "" + '(Yourself)',
        contactColor: userColor,
  }
  return UserInformation
}

/**
 * this function clears the current content of the taskfields
 * 
 */

function clearTasks(){
  let taskStatus = ["Todo","InProgress","Feedback","Done"]
  taskStatus.forEach(element => {
    document.getElementById("cards"+element).innerHTML="";
    document.getElementById("no"+element).classList.add("no-tasks")
  });
  showTasks();
}

/**
 * This function shows the current tasks
 * 
 */

function showTasks() {
  for (let i = 0; i < currentTasks.length; i++) {
    let statusTask = currentTasks[i].taskStatus;
    let taskId = 'cards' + statusTask;
    let card = document.getElementById(taskId);
    let taskCategoryColor = currentTasks[i].taskCategory.toLowerCase().replace(/\s+/g, '')
    card.innerHTML += cardContentHtml(i, taskCategoryColor);
    document.getElementById("no"+statusTask).classList.remove("no-tasks")
  }
}

/**
 * This function returns the current priority of the task
 * 
 * @param {number} i is the current number of the array
 * @returns returns the value of priority
 */

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

/**
 * This function shows the detail card
 * 
 * @param {string} id this parameter is the current chosen card id
 */

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
  getChosenNamesContacts();
}

/**
 * This function get the current chosen Contacts and show them
 * 
 */

function getChosenNamesContacts(){
  let nameList = document.getElementById('chosenNameList')
  let chosenDetailContacts = chosenCards.taskAssignedTo;
  nameList.innerHTML = ""
  if(!chosenDetailContacts) return
  chosenDetailContacts.forEach(contactId => {
    let contactDetail = currentContacts.find(c => c.contactId === contactId);
    if (contactDetail) {
      let { contactName: nameDetail, contactColor: colorDetail } = contactDetail;
      let initialsDetail = getShortcut(nameDetail);
      nameList.innerHTML += showChosenCardContactHtml(nameDetail, colorDetail, initialsDetail)
    }
  });
  getSubtasksCard()
}

/**
 * this function get the subtask of the current chosen card
 * 
 */

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
  loadTasks();
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
    let checkedTasks = checkAmount(subtask)
    return /* html */ `
        <div class="progressbar-status">
            <progress id="file${i}" value="${checkedTasks}" max="${subtask.length}"></progress>
          	<label for="file${i}">${checkedTasks}/${subtask.length} Subtasks</label>
        </div>`;
  }
}

function checkAmount(subtask){
  let checkAmount = 0
  for (let i = 0; i < subtask.length; i++) {
    if (subtask[i].completed){
      checkAmount++
    };
  }
  return checkAmount
}

function cardContacts(i) {
  let assignedContacts = currentTasks[i].taskAssignedTo || [];
  let contactHTML = "";
  assignedContacts.forEach(contactId => {
    let contact = currentContacts.find(c => c.contactId === contactId);
    if (contact) {
      let { contactName: name, contactColor: color } = contact;
      let initials = getShortcut(name);
      contactHTML += `<div class="shortcut" style="background-color:${color};">${initials}</div>`;
    }
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
  loadTasks();
  closeDetailCard();
}

function searchInBoard() {
    let input = document.getElementById('inputSearch');
    let filter = input.value.toUpperCase();
    let tasksFilter = ["Todo", "InProgress", "Feedback", "Done"];   
    for (let i = 0; i < tasksFilter.length; i++) {
        let tasksContainer = document.getElementById('tasks' + tasksFilter[i]);
        let search = document.getElementById('cards' + tasksFilter[i]).getElementsByClassName('board-content');
        let anyVisible = false;
        if (filter === "") {
            tasksContainer.classList.remove('d_noneimp');
            document.getElementById('boardMenu').style.justifyContent = 'space-between';
            Array.from(search).forEach(element => { element.style.display = "";});
        } else {
            anyVisible = filterTask(filter, search);
            if (!anyVisible) {
                tasksContainer.classList.add('d_noneimp');
                document.getElementById('boardMenu').style.justifyContent = 'flex-start';
            } else {
                tasksContainer.classList.remove('d_noneimp');
            }
        }
    }
}

function filterTask(filter, search) {
  let anyVisible = false;
  for (let i = 0; i < search.length; i++) {
      let title = search[i].getElementsByClassName('title')[0];
      let description = search[i].getElementsByClassName('description')[0];
      let titleTxtValue = title.textContent || title.innerText;
      let descriptionTxtValue = description.textContent || description.innerText;
      if (titleTxtValue.toUpperCase().indexOf(filter) > -1 || descriptionTxtValue.toUpperCase().indexOf(filter) > -1) {
          search[i].style.display = "";
          anyVisible = true;
      } else {
          search[i].style.display = "none";
      }
  }
  return anyVisible;
}