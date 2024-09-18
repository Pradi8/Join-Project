let guestTasks = [];
let guestContacts = [];

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

function saveGuestData() {
  localStorage.setItem("localGuestTasks", JSON.stringify(guestTasks));
}

function loadGuestSummary() {
  let guestDataAsText = localStorage.getItem("localGuestTasks");
  if (guestDataAsText) {
    guestTasks = JSON.parse(guestDataAsText);
  }
  currentTasks = guestTasks
  showSummaryUser();
}

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

function loadTasksGuest() {
  let guestTasksAsText = localStorage.getItem("localGuestTasks");
  if (guestTasksAsText) {
    guestTasks = JSON.parse(guestTasksAsText);
  }
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
    guestTasks[j].subtasks[i].completed = checked
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
  closeDetailCard()
}


function translateDatas(){
  guestData.taskStatus = data.taskStatus;
  guestData.title= data.title;
  guestData.description = data.description;
  guestData.assignedTo = data.assignedTo;
  guestData.dueDate = data.dueDate;
  guestData.prio = data.prio;
  guestData.category = data.category;
  guestData.subtasks = data.subtasks;
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
  document.getElementById('succesAddedTask').classList.add('added-task') 
  setTimeout(() => {
    document.getElementById('succesAddedTask').classList.remove('added-task')
    if(window.location === "add_task.html") return window.location.href = "board.html"
    clearForm()
  }, 1000);
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
