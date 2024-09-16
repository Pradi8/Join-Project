const BASE_URL = "https://login-de5c5-default-rtdb.europe-west1.firebasedatabase.app/";
const CONTACT_URL = "https://contacts-e1e72-default-rtdb.europe-west1.firebasedatabase.app/";
const BOARD_URL = "https://board-c7512-default-rtdb.europe-west1.firebasedatabase.app/";
const GUEST_URL = "https://guest-31a20-default-rtdb.europe-west1.firebasedatabase.app/";
const GUESTCONTACT_URL = "https://guestcontacts-cf702-default-rtdb.europe-west1.firebasedatabase.app/"
const DEMOCONTACT_URL = "https://democontacts-119cd-default-rtdb.europe-west1.firebasedatabase.app/"

let userName;
let userId;
let userColor = "gold";
let currentTasks = [];
let errorCount = 0;
let currentContacts = [];

function loadUser() {
  let userNameAsText = localStorage.getItem("userName");
  let userIdAsText = localStorage.getItem("userId");
  if (userNameAsText && userIdAsText) {
    userName = JSON.parse(userNameAsText);
    userId = JSON.parse(userIdAsText);
  }
  else{
    window.location.href = "index.html"
  }
  return checkBoardDatabase();
}

function selectField(selectedField) {
  let blueline = document.getElementById(selectedField);
  blueline.parentNode.classList.add("blue-border");
}
function unselectField(selectedField) {
  let blueline = document.getElementById(selectedField);
  blueline.parentNode.classList.remove("blue-border");
}

function stopPropagation(event) {
  event.stopPropagation();
}

function setuserName() {
  localStorage.setItem("userName", JSON.stringify(userName));
  localStorage.setItem("userId", JSON.stringify(userId));
  window.location.href = "summary.html";
}

async function checkBoardDatabase() {
  if(userId === "guest") return loadContacts()
  try {
    let responseID = await fetch(BOARD_URL + userId + ".json");
    let responseIdToJson = await responseID.json();
    if (responseIdToJson) {
      return getUserBoard();
    } 
    else{
      await fetch(BOARD_URL + userId  + ".json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(false),
      });
      return getUserBoard()
    }
  } catch (error) {
    if (errorCount === 10) {
      alert("Server error! Try again later");
    }
    checkBoardDatabase()
    errorCount++
  }
}

async function getUserBoard() {
  currentTasks = [];
  try {
    let responseBoard = await fetch(BOARD_URL + userId + ".json");
    currentBoards = await responseBoard.json();
    Object.keys(currentBoards).forEach((key) => {
      let currentTaskContents = createTaskContents(key, currentBoards[key]);
      currentTasks.push(currentTaskContents);
    });
    return loadContacts()
  } catch (error) {
    if (errorCount === 10) {
      alert("Server error! Try again later");
    }
    errorCount++;
    getUserBoard();
  }
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

async function loadContacts() {
  currentContacts = [userAsContact()];
  let userUrl = CONTACT_URL
  if(userId === "guest") userUrl = GUESTCONTACT_URL;
  try {
    let loadResponse = await fetch(userUrl + userId + ".json");
    let contactToJson = await loadResponse.json();
    Object.keys(contactToJson).forEach((key) => {
      let currentContactInformation = {
        contactId: key,
        contactName: contactToJson[key].contactName,
        contactEmail: contactToJson[key].contactEmail,
        contactPhone: contactToJson[key].contactPhone,
        contactColor: contactToJson[key].contactColor
      };
      currentContacts.push(currentContactInformation);
    });
    return
   } catch (error) {
    if (errorCount === 10) {
      return loadDemoContacts()
    }
    errorCount++
    loadContacts()    
  }
  return
}

function userAsContact(){
  let UserInformation={
    contactId: userId,
    contactName: userName + "" + '(Yourself)',
    contactColor: userColor,
  }
  return UserInformation
}

async function loadDemoContacts() {
  try {
    let loadResponse = await fetch(DEMOCONTACT_URL + ".json");
    let contactToJson = await loadResponse.json();
    Object.keys(contactToJson).forEach((key) => {
      let currentContactInformation = {
        contactId: key,
        contactName: contactToJson[key].contactName,
        contactEmail: contactToJson[key].contactEmail,
        contactPhone: contactToJson[key].contactPhone,
        contactColor: contactToJson[key].contactColor
      };
      currentContacts.push(currentContactInformation);
      errorCount = 0
    });
   } catch (error) {
    if (errorCount === 10) {
      return errorCount = 0      
    }
    errorCount++
    loadDemoContacts()    
  }
  return
}