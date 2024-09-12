let guestTasks = [];
let guestContacts = [];

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
console.log(checked + i);

}

function addGuestTask(){
  guestTasks.push(data) 
  console.log(guestTasks);
   
}