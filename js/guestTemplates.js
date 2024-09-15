let guestTasks = [];
let guestContacts = [];

let guestData = {
  taskStatus: "",
  taskTitle: "",
  taskDescription: "",
  taskAssignedTo: [],
  taskDueDate: "",
  taskPrio: {
    urgent: false,
    medium: false,
    low: false,
  },
  taskCategory: "",
  taskSubtasks: [],
};

function saveGuestData() {
  localStorage.setItem("localGuestTasks", JSON.stringify(guestTasks));
}

function loadGuestSummary() {
  let guestDataAsText = localStorage.getItem("localGuestTasks");
  if (guestDataAsText) {
    guestTasks = JSON.parse(guestDataAsText);
  } else {
    getGuestDatas();
  }
  currentTasks = guestTasks
  showSummaryUser();
}

async function getGuestDatas() {
  try {
    let responseTaskLenght = await fetch(GUEST_URL + userId + ".json");
    let tasks = await responseTaskLenght.json();
    if (tasks === null) {
      userSummary.innerHTML = showSummaryHtml();
      return;
    }
    Object.keys(tasks).forEach((key) => {
      let currentTaskContents = createGuestTaskContents(key, tasks[key]);
      guestTasks.push(currentTaskContents);
    });
   localStorage.setItem("localGuestTasks" , JSON.stringify(guestTasks))
   loadGuestSummary()
  } catch (error) {
    getGuestDatas();
  }
}

function createGuestTaskContents(key, taskData) {
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

function loadTasksGuest() {
  let guestTasksAsText = localStorage.getItem("localGuestTasks");
  if (guestTasksAsText) {
    guestTasks = JSON.parse(guestTasksAsText);
  }
  showGuestTasks();
}

function showGuestTasks() {
  currentTasks = guestTasks;
  clearTasks();
}

function saveDropLocal(taskId, task){
for (let i = 0; i < guestTasks.length; i++) {
  if(guestTasks[i].taskId === taskId){
    guestTasks[i].taskStatus = task
  }
}
saveGuestData()
changeContentDrop(task)
}

function changeGuestTaskStatus(taskId, changeStatusValue){
for (let i = 0; i < guestTasks.length; i++) {
  if(guestTasks[i].taskId === taskId){
    guestTasks[i].taskStatus = changeStatusValue
  }
}
saveGuestData()
loadTasksGuest()
}

function changeGuestCheckedSub(checked, i){
for (let j = 0; j < guestTasks.length; j++) {
  if(guestTasks[j].taskId === chosenCards.taskId){
    guestTasks[j].taskSubtasks[i].completed = checked
  }  
}
saveGuestData()
loadTasksGuest()
}

function deleteGuestCard(){
  for (let i = 0; i < guestTasks.length; i++) {
    if (guestTasks[i].taskId === chosenCards.taskId) {
      guestTasks.splice(i)
    }    
  }
  saveGuestData()
  loadTasksGuest()
}


function translateDatas(){
  guestData.taskStatus = data.taskStatus;
  guestData.taskTitle= data.title;
  guestData.taskDescription = data.description;
  guestData.taskAssignedTo = data.assignedTo;
  guestData.taskDueDate = data.dueDate;
  guestData.taskPrio = data.prio;
  guestData.taskCategory = data.category;
  guestData.taskSubtasks = data.subtasks;
  addGuestTask()
}

function addGuestTask(){
  guestData.taskId = generateRandomString()
  let guestDataAsText = localStorage.getItem("localGuestTasks");
  if (guestDataAsText) {
    guestTasks = JSON.parse(guestDataAsText);
  }
  guestTasks.push(guestData);
  saveGuestData();
}


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
