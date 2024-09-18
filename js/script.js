const BASE_URL = "https://login-de5c5-default-rtdb.europe-west1.firebasedatabase.app/";
const CONTACT_URL = "https://contacts-e1e72-default-rtdb.europe-west1.firebasedatabase.app/";
const BOARD_URL = "https://board-c7512-default-rtdb.europe-west1.firebasedatabase.app/";
const GUEST_URL = "https://guest-31a20-default-rtdb.europe-west1.firebasedatabase.app/";
const GUESTCONTACT_URL = "https://guestcontacts-cf702-default-rtdb.europe-west1.firebasedatabase.app/";
const DEMOCONTACT_URL = "https://democontacts-119cd-default-rtdb.europe-west1.firebasedatabase.app/";
const DEMOBOARD_URL = "https://demotasks-97b71-default-rtdb.europe-west1.firebasedatabase.app/";

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
  } else {
    window.location.href = "index.html";
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
  let boardUrl = BOARD_URL
  if (userId === "guest") boardUrl = GUEST_URL;
  try {
    let responseId = await fetch(boardUrl + userId + ".json");
    let responseIdToJson = await responseId.json();
    if (responseIdToJson) {
      return getUserBoard(responseIdToJson);
    } else {
      let responseDemo = await fetch(DEMOBOARD_URL + ".json");
      let responseDemoToJson = await responseDemo.json();
      return saveDemoBoard(responseDemoToJson);
    }
  } catch (error) {
    if (errorCount === 10) {
      /* alert("Server error! Try again later"); */
      return checkContactDatabase()
    }
    checkBoardDatabase();
    errorCount++;
  }
}

async function getUserBoard(currentBoards) {
  currentTasks = [];
  Object.keys(currentBoards).forEach((key) => {
    let currentTaskContents = createTaskContents(key, currentBoards[key]);
    currentTasks.push(currentTaskContents);
  });
  return checkContactDatabase();
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
    assignedTo: taskData.assignedTo,
    category: taskData.category,
    description: taskData.description,
    dueDate: taskData.dueDate,
    prio: taskData.prio,
    taskStatus: taskData.taskStatus,
    title: taskData.title,
    subtasks: taskData.subtasks,
  };
}

async function checkContactDatabase() {
  let userUrl = CONTACT_URL;
  if (userId === "guest") userUrl = GUESTCONTACT_URL;
  try {
    let responseContact = await fetch(userUrl + userId + ".json");
    let responseContactToJson = await responseContact.json();
    if (responseContactToJson) {
      return loadContacts(responseContactToJson);
    } else {
      let responseDemoContact = await fetch(DEMOCONTACT_URL + ".json");
      let responseDemoContactToJson = await responseDemoContact.json();
      return saveDemoContacts(responseDemoContactToJson);
    }
  } catch (error) {
    if (errorCount === 10) {
      alert("Server error! Try again later");
    }
    checkContactDatabase();
    errorCount++;
  }
}

function loadContacts(contactToJson, demo) {
  currentContacts = [];
  currentContacts.push(userAsContact());
  Object.keys(contactToJson).forEach((key) => {
    let currentContactInformation = createCurrentContacts(key,contactToJson[key]);
    currentContacts.push(currentContactInformation);
  });
  if (demo) {
    saveDemoContacts()
  }
  return;
}

function createCurrentContacts(key, contactToJson) {
  return {
    contactId: key,
    contactName: contactToJson.contactName,
    contactEmail: contactToJson.contactEmail,
    contactPhone: contactToJson.contactPhone,
    contactColor: contactToJson.contactColor,
  };
}

function userAsContact() {
  let UserInformation = {
    contactId: userId,
    contactName: userName + "" + "(Yourself)",
    contactColor: userColor,
  };
  return UserInformation;
}

async function saveDemoBoard(responseDemoToJson) {
      await fetch(BOARD_URL + userId + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseDemoToJson),
    });
  return checkBoardDatabase()
}

async function saveDemoContacts(responseDemoContactToJson) {
    await fetch(CONTACT_URL + userId + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseDemoContactToJson),
    });
    return checkContactDatabase();
}
