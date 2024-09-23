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
  if(userId === "guest") loadTasksGuest()
  clearTasks()
}

/**
 * This function clear all tasks and give them no-tasks inside
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
    let categoryColor = currentTasks[i].category.toLowerCase().replace(/\s+/g, '')
    card.innerHTML += cardContentHtml(i, categoryColor);
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
  let currentPrio = currentTasks[i].prio;
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

function showDetailCard(id, categoryColor){
  let detailsCard = document.getElementById('detailedCard')
  for (let i = 0; i < currentTasks.length; i++) {
    if(currentTasks[i].taskId === id)
    chosenCards= currentTasks[i];
  }
  let detailPrio = getPrioDetailCard()
  detailsCard.innerHTML = showDetailCardHtml(detailPrio, categoryColor)
  detailsCard.classList.add('detail-card')
  document.getElementById('taskStatusChange').value = chosenCards.taskStatus;
  getChosenNamesContacts();
  if(userId === "guest") document.getElementById('btnEditCard').classList.add("btn-disabled")
}

/**
 * This function get the current chosen Contacts and show them
 * 
 */

function getChosenNamesContacts(){
  let nameList = document.getElementById('chosenNameList')
  let chosenDetailContacts = chosenCards.assignedTo;
  nameList.innerHTML = ""
  if(!chosenDetailContacts) return getSubtasksCard()
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
    if(chosenCards.subtasks && chosenCards.subtasks.length > 0){
    document.getElementById('subtaskDetails').classList.remove('d_none')
    let subtaskList = document.getElementById('subtaskList')
    let chosenTask = chosenCards.subtasks
    for (let i = 0; i < chosenTask.length; i++) {
      let checked = chosenTask[i].completed
      let subtaskContent = chosenTask[i].newsubtask
      subtaskList.innerHTML += showCardSubtasksHtml(i, checked, subtaskContent)
    };
  }
}

/**
 * Updates the completion status of a subtask and saves the change to the database.
 * 
 * @param {boolean} checked - The new completion status of the subtask (true for completed, false for incomplete).
 * @param {number} i - The index of the subtask in the current task's subtask array.
 * 
 * @returns {Promise<void>} - A promise that resolves when the subtask status has been updated and tasks have been reloaded.
 */
async function changeCheckedSub(checked, i){
  if(userId === "guest") return changeGuestCheckedSub(checked, i);
  await fetch(BOARD_URL + userId + "/" + chosenCards.taskId + "/" + "subtasks" + "/" +  i + "/" + "completed" + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checked),
  });
  loadTasks();
}


/**
 * this function close the current detail card
 * 
 */

function closeDetailCard(){
  document.getElementById('detailedCard').classList.remove("detail-card")
}

/**
 * This function get the current proirity of the chosen card
 * 
 * @returns  this returns the current priority value
 */

function getPrioDetailCard(){
    let currentPrio = chosenCards.prio;
    let prio = null;
    Object.entries(currentPrio).forEach(([key, value]) => {
      if (value) {
        prio = key;
      }
    });
    return prio;
}

/**
 * This function load the current status of subtasks
 * 
 * @param {number} i 
 * @returns returns the visual status of the progressbar
 */

function loadSuptaskStatus(i) {
  let subtask = currentTasks[i].subtasks;
  if (!subtask || subtask == '') {
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

/**
 * This funktion get the current amount of subtasks in card
 * 
 * @param {string} subtask This parameter are the current subtasks of the current task
 * @returns returns the amount of checked subtasks
 */

function checkAmount(subtask){
  let checkAmount = 0
  for (let i = 0; i < subtask.length; i++) {
    if (subtask[i].completed){
      checkAmount++
    };
  }
  return checkAmount
}

/**
 * This function get the current assigned contacts of the cards
 * 
 * @param {number} i This parameter is the current array number of the card 
 * @returns returns the contact html
 */

function cardContacts(i) {
  let assignedContacts = currentTasks[i].assignedTo || [];
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

/**
 * This function chnage the contact name into shortcut
 * 
 * @param {string} name This parameter is the name of one contact
 * @returns {string} returns the initials of the name
 */

function getShortcut(name) {
  let shortcut = "";
  let words = name.split(" ").map(word => word.replace(/[^a-zA-Z]/g, ''));
  if (words.length > 0) {
    shortcut += words[0].charAt(0).toUpperCase();
    if (words.length > 1) {
      shortcut += words[words.length - 1].charAt(0).toUpperCase();
    }
  }
  return shortcut;
}

/**
 * This function open the add task mode
 * 
 * @param {string} taskStatus this parameter is the current task status of the card (e.g. 'Todo')
 */

function openBoardPopup(taskStatus) {
  document.getElementById("addTaskBoard").classList.add("edit-new-task");
  chosenTaskStatus = taskStatus;
  taskPrioMedium()
}

/**
 * This function close the add task board popup
 * 
 */

function closeBoardPopup() {
  document.getElementById("addTaskBoard").classList.remove("edit-new-task");
  clearForm();
  loadTasks();
}

/**
 * This function opens the add task html site
 */

function openAddTask(){
  window.location.href = "add_task.html";
}

/**
 * This function change the current status of the card in responsive mode (e.g. from 'Todo' to 'Done')
 * @returns if the user is "guest" than the function returns and open a guest function
 */

async function changeStatus(){
  let changeStatusValue = document.getElementById('taskStatusChange').value
  let taskId = chosenCards.taskId;
  if(userId === "guest") return changeGuestTaskStatus(taskId, changeStatusValue)
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

/**
 * This function delete the current chosen card
 * 
 * @returns if user id is "gest" than return the function and jump to delete guest
 * 
 */

async function deleteCard(){
  if(userId === "guest") return deleteGuestCard();
    await fetch(BOARD_URL + userId + "/" + chosenCards.taskId + ".json", {
    method:"DELETE"
  })
  await loadTasks();
  closeDetailCard();
}

/**
 * this function search the input value and show the card that have the value in title and description
 */

function searchInBoard() {
  let input = document.getElementById('inputSearch');
  let filter = input.value.toUpperCase();
  let tasksFilter = ["Todo", "InProgress", "Feedback", "Done"];
  let anyTaskVisible = false; 
  for (let i = 0; i < tasksFilter.length; i++) {
      let tasksContainer = document.getElementById('tasks' + tasksFilter[i]);
      let search = document.getElementById('cards' + tasksFilter[i]).getElementsByClassName('board-content');
      let anyVisible = false;
      if (filter === "") {
          tasksContainer.classList.remove('d_noneimp');
          document.getElementById('boardMenu').style.justifyContent = 'space-between';
          Array.from(search).forEach(element => { element.style.display = ""; });
          anyTaskVisible = true; 
      } else {
          anyVisible = filterTask(filter, search);
          if (!anyVisible) {
              tasksContainer.classList.add('d_noneimp');
              document.getElementById('boardMenu').style.justifyContent = 'flex-start';
          } else {
              tasksContainer.classList.remove('d_noneimp');
              anyTaskVisible = true; 
          }
      }
  }
 empteySearchMsg(anyTaskVisible, filter);
}

/**
 * This function will show a message if no search results are found
 * @param {boolean} anyTaskVisible - A boolean indicating if any tasks are visible
 * @param {string} filter - The search filter text 
 */

function empteySearchMsg(anyTaskVisible, filter){
  if (!anyTaskVisible && filter !== "") {
    document.getElementById('msgNoTaskFound').classList.remove("d_none");
  }
  else{
    document.getElementById('msgNoTaskFound').classList.add("d_none");
  }

}

/**
* Filters the tasks based on the provided filter text
 * @param {string} filter - The search filter text
 * @param {HTMLElement} search - An array of HTML elements representing tasks to search
 * @returns {boolean} - Returns true if any tasks are visible after filtering, otherwise false
 */

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