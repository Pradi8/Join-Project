let guestData = {
  taskStatus: "",
  title: "",
  description: "",
  assignedTo: [],
  dueDate: "",
  prio: {
    urgent: false,
    medium: false,
    low: false,
  },
  category: "",
  subtasks: [],
};

/**
 * Saves the current guest task data to localStorage. The task data is stored
 * as a JSON string under the key "localGuestTasks".
 */
function saveGuestData() {
  localStorage.setItem("localGuestTasks", JSON.stringify(currentTasks));
}

/**
 * Loads the guest summary from localStorage. If data is available, it loads the guest tasks
 * from localStorage; otherwise, it fetches the tasks from the server using `loadTasksGuest()`.
 * After loading, it displays a summary for the user.
 */
function loadGuestSummary() {
  let guestDataAsText = localStorage.getItem("localGuestTasks");
  if (guestDataAsText && guestDataAsText != '[]') {
    currentTasks = JSON.parse(guestDataAsText);
  } else {
    loadTasksGuest();
  }
  showSummaryUser();
}

/**
 * Loads guest tasks from localStorage or, if no tasks are found, fetches them
 * from the server. The fetched tasks are stored locally and the data is saved to localStorage.
 * 
 * @returns {Promise} - A promise that resolves after the guest tasks are loaded and saved.
 */
async function loadTasksGuest() {
  let guestTasksAsText = localStorage.getItem("localGuestTasks");
  if (guestTasksAsText && guestTasksAsText != '[]') {
    currentTasks = JSON.parse(guestTasksAsText);
  } else {
    let responseId = await fetch(GUEST_URL + userId + ".json");
    let responseIdToJson = await responseId.json();
    Object.keys(responseIdToJson).forEach((key) => {
      let currentGuestTaskContents = createGuestTaskContents(key, responseIdToJson[key]);
      currentTasks.push(currentGuestTaskContents);
      saveGuestData();
    });
  }
  return checkContactDatabase();
}

/**
 * Creates and returns an object representing the contents of a guest task.
 * 
 * @param {string} key - The task ID.
 * @param {Object} taskData - An object containing task details like title, description, etc.
 * @returns {Object} - A task object with the given key and data.
 */
function createGuestTaskContents(key, taskData) {
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
 * Updates the status of a task after it's dropped in a new category and saves the updated task.
 * 
 * @param {string} taskId - The ID of the task to update.
 * @param {string} task - The new status of the task (e.g., "In Progress").
 */
function saveDropLocal(taskId, task) {
  for (let i = 0; i < currentTasks.length; i++) {
    if (currentTasks[i].taskId === taskId) {
      currentTasks[i].taskStatus = task;
    }
  }
  saveGuestData();
  changeContentDrop(task);
}

/**
 * Changes the status of a guest task and updates localStorage.
 * 
 * @param {string} taskId - The ID of the task to update.
 * @param {string} changeStatusValue - The new task status (e.g., "Completed").
 */
function changeGuestTaskStatus(taskId, changeStatusValue) {
  for (let i = 0; i < currentTasks.length; i++) {
    if (currentTasks[i].taskId === taskId) {
      currentTasks[i].taskStatus = changeStatusValue;
    }
  }
  saveGuestData();
  clearTasks();
}

/**
 * Updates the status of a subtask (completed or not) for a specific task and index.
 * 
 * @param {boolean} checked - Whether the subtask is completed (true/false).
 * @param {number} i - The index of the subtask in the task's subtask list.
 */
function changeGuestCheckedSub(checked, i) {
  for (let j = 0; j < currentTasks.length; j++) {
    if (currentTasks[j].taskId === chosenCards.taskId) {
      currentTasks[j].subtasks[i].completed = checked;
    }
  }
  saveGuestData();
  clearTasks();
}

/**
 * Deletes the currently selected task from the list of guest tasks and updates localStorage.
 * It also clears the task display and closes the task details view.
 */
function deleteGuestCard() {
  for (let i = 0; i < currentTasks.length; i++) {
    if (currentTasks[i].taskId === chosenCards.taskId) {
      currentTasks.splice(i, 1);
    }
  }
  saveGuestData();
  clearTasks();
  closeDetailCard();
}

/**
 * Translates form data into the `guestData` object, populating the necessary fields
 * like task status, title, description, etc., and then adds the task.
 */
function translateDatas() {
  guestData.taskStatus = data.taskStatus;
  guestData.title = data.title;
  guestData.description = data.description;
  guestData.assignedTo = data.assignedTo;
  guestData.dueDate = data.dueDate;
  guestData.prio = data.prio;
  guestData.category = data.category;
  guestData.subtasks = data.subtasks;
  addGuestTask();
}

/**
 * Adds the guest task to the current list of tasks, saves the task to localStorage,
 * and displays a success message. After a short delay, it clears the form or redirects the user.
 */
function addGuestTask() {
  guestData.taskId = generateRandomString();
  let guestDataAsText = localStorage.getItem("localGuestTasks");
  if (guestDataAsText) {
    guestTasks = JSON.parse(guestDataAsText);
  }
  currentTasks.push(guestData);
  saveGuestData();
  document.getElementById('succesAddedTask').classList.add('added-task');
  setTimeout(() => {
    document.getElementById('succesAddedTask').classList.remove('added-task');
    if(window.location.pathname === "/add_task.html") return window.location.href = "board.html"
    clearForm();
  }, 1000);
}

/**
 * Generates a random alphanumeric string of 18 characters to use as a unique task ID.
 * 
 * @returns {string} - A randomly generated string.
 */
function generateRandomString() {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let length = 18;
  let result = '-';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}