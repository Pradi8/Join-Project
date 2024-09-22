const BASE_URL = "https://login-de5c5-default-rtdb.europe-west1.firebasedatabase.app/";
const CONTACT_URL = "https://contacts-e1e72-default-rtdb.europe-west1.firebasedatabase.app/";
const BOARD_URL = "https://board-c7512-default-rtdb.europe-west1.firebasedatabase.app/";
const GUEST_URL = "https://guest-31a20-default-rtdb.europe-west1.firebasedatabase.app/";
const GUESTCONTACT_URL = "https://guestcontacts-cf702-default-rtdb.europe-west1.firebasedatabase.app/";
const DEMOCONTACT_URL = "https://democontacts-119cd-default-rtdb.europe-west1.firebasedatabase.app/";
const DEMOBOARD_URL = "https://demotasks-97b71-default-rtdb.europe-west1.firebasedatabase.app/";

let userName;
let userId;
let userEmail;
let userColor = "gold";
let currentTasks = [];
let errorCount = 0;
let currentContacts = [];

/**
 * Loads the user data from localStorage and initializes the application.
 * If no user data is found, redirects to the index page.
 *
 * @returns {Promise<void>} - Returns a promise that resolves after checking the board database.
 */
function loadUser() {
  let userNameAsText = localStorage.getItem("userName");
  let userIdAsText = localStorage.getItem("userId");
  let userEmailAsText = localStorage.getItem("userEmail");
  if (userNameAsText && userIdAsText && userEmailAsText) {
    userName = JSON.parse(userNameAsText);
    userId = JSON.parse(userIdAsText);
    userEmail = JSON.parse(userEmailAsText);
  } else {
    window.location.href = "index.html";
  }
  return checkBoardDatabase();
}

/**
 * Adds a blue border to the selected input field's parent element.
 *
 * @param {string} selectedField - The ID of the selected field.
 */
function selectField(selectedField) {
  let blueline = document.getElementById(selectedField);
  blueline.parentNode.classList.add("blue-border");
}

/**
 * Removes the blue border from the selected input field's parent element.
 *
 * @param {string} selectedField - The ID of the selected field.
 */
function unselectField(selectedField) {
  let blueline = document.getElementById(selectedField);
  blueline.parentNode.classList.remove("blue-border");
}

/**
 * Stops the propagation of an event, preventing it from bubbling up.
 *
 * @param {Event} event - The event to stop.
 */
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * Saves the user data to localStorage and redirects to the summary page.
 */
function setuserName() {
  localStorage.setItem("userName", JSON.stringify(userName));
  localStorage.setItem("userId", JSON.stringify(userId));
  localStorage.setItem("userEmail", JSON.stringify(userEmail));
  window.location.href = "summary.html";
}

/**
 * Checks the board database for the current user. If the user is a guest, loads the guest tasks.
 * If the user is not a guest, fetches the board data from the server.
 *
 * @returns {Promise<void>} - A promise that resolves when the database check is complete.
 */
async function checkBoardDatabase() {
  if (userId === "guest") return loadTasksGuest();
  try {
    let responseId = await fetch(BOARD_URL + userId + ".json");
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
      return checkBoardDatabase();
    }
    checkBoardDatabase();
    errorCount++;
  }
}

/**
 * Processes the current boards and tasks retrieved from the database and initializes them.
 *
 * @param {Object} currentBoards - The board data retrieved from the database.
 * @returns {Promise<void>} - A promise that resolves when contact data is checked.
 */
async function getUserBoard(currentBoards) {
  currentTasks = [];
  Object.keys(currentBoards).forEach((key) => {
    let currentTaskContents = createTaskContents(key, currentBoards[key]);
    currentTasks.push(currentTaskContents);
  });
  return checkContactDatabase();
}

/**
 * Creates and returns the task content structure for a specific task.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {Object} taskData - The task data retrieved from the database.
 * @returns {Object} - An object containing the task details.
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

/**
 * Checks the contact database for the current user. If the user is a guest, loads guest contacts.
 * If no contacts are found, fetches demo contact data.
 *
 * @returns {Promise<void>} - A promise that resolves when the contact data is checked.
 */
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
      let demoContacts = userAsContact()
      Object.assign(demoContacts, responseDemoContactToJson);
      return saveDemoContacts(demoContacts);
    }
  } catch (error) {
    if (errorCount === 10) {
      alert("Server error! Try again later");
    }
    checkContactDatabase();
    errorCount++;
  }
}

/**
 * Loads the contact data into the currentContacts array.
 *
 * @param {Object} contactToJson - The contact data retrieved from the database.
 */
function loadContacts(contactToJson) {
  currentContacts = [];
  Object.keys(contactToJson).forEach((key) => {
    let currentContactInformation = createCurrentContacts(key, contactToJson[key]);
    currentContacts.push(currentContactInformation);
  });
  return;
}

/**
 * Creates and returns the contact details for a specific contact.
 *
 * @param {string} key - The unique identifier of the contact.
 * @param {Object} contactToJson - The contact data retrieved from the database.
 * @returns {Object} - An object containing the contact details.
 */
function createCurrentContacts(key, contactToJson) {
  return {
    contactId: key,
    contactName: contactToJson.contactName,
    contactEmail: contactToJson.contactEmail,
    contactPhone: contactToJson.contactPhone,
    contactColor: contactToJson.contactColor,
  };
}

/**
 * Creates and returns the current user as a contact.
 *
 * @returns {Object} - An object containing the user's contact details.
 */
function userAsContact() {
  let userAsContactId = generateRandomId()
  let UserInformation = {
    [userAsContactId]:{
    contactId: userId,
    contactName: userName + "" + "(You)",
    contactColor: userColor,
    contactEmail: userEmail,
    contactPhone: "+497264512434",
    }
  };
  return UserInformation;
}
/**
 * this function generates a random id for the user as contact in database
 * @returns {string} - return the random user id
 */

function generateRandomId() {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '-user';
  let charactersLength = characters.length;
  for (let i = 0; i < 13; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Saves the demo board data to the server for the current user.
 *
 * @param {Object} responseDemoToJson - The demo board data.
 * @returns {Promise<void>} - A promise that resolves when the board data is saved.
 */
async function saveDemoBoard(responseDemoToJson) {
  await fetch(BOARD_URL + userId + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responseDemoToJson),
  });
  return checkBoardDatabase();
}

/**
 * Saves the demo contact data to the server for the current user.
 *
 * @param {Object} responseDemoContactToJson - The demo contact data.
 * @returns {Promise<void>} - A promise that resolves when the contact data is saved.
 */
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

/**
 * Moves the element with an id starting with "-user" to the front of the currentContacts array.
 * If no such element is found, the array remains unchanged.
 */
function userAsContactFirst() {
  let userIndex = currentContacts.findIndex(contact => contact.contactId.startsWith("-user"));
  if (userIndex > -1) {
    let userContact = currentContacts.splice(userIndex, 1)[0];  
    currentContacts.unshift(userContact);
  }
}